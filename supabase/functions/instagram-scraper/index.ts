import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

/* ==========================
   CORS
========================== */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/* ==========================
   SUPABASE
========================== */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/* ==========================
   TYPES
========================== */

interface RequestPayload {
  audioId: string;
  sessionId?: string;
  restart?: boolean;
}

interface ScrapedData {
  reels: any[];
  audioMetadata: any;
  maxId: string;
  hasMore: boolean;
  totalClips: number;
}

/* ==========================
   ACCOUNT ROTATION
========================== */

async function getNextActiveAccount() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("instagram_accounts")
    .select("*")
    .eq("status", "active")
    .or(`cooldown_until.is.null,cooldown_until.lte.${now}`)
    .order("last_used_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new Error("No active Instagram accounts available");
  }

  return data;
}

async function markAccountUsed(account: any) {
  const cooldownSeconds = account.cooldown_seconds ?? 5;
  const cooldownUntil = new Date(Date.now() + cooldownSeconds * 1000).toISOString();

  await supabase
    .from("instagram_accounts")
    .update({
      last_used_at: new Date().toISOString(),
      cooldown_until: cooldownUntil,
    })
    .eq("id", account.id);
}

async function markAccountFailed(account: any, status: "blocked" | "failed") {
  await supabase
    .from("instagram_accounts")
    .update({
      status,
      failure_count: (account.failure_count ?? 0) + 1,
    })
    .eq("id", account.id);
}

/* ==========================
   INSTAGRAM FETCH
========================== */

async function fetchInstagramData(
  audioId: string,
  maxId: string,
  account: any
): Promise<ScrapedData> {

  /* --------------------------
     HEADERS (RAW + REFERER)
  -------------------------- */

  const rawHeaders =
  typeof account.headers === "string"
    ? JSON.parse(account.headers)
    : account.headers;

  const headers = {
    ...rawHeaders,
    Referer: `https://www.instagram.com/reels/audio/${audioId}`,
  };


  /* --------------------------
     BODY (RAW → JSON → MUTATE)
  -------------------------- */

  // Raw body is stored exactly as captured
  const bodyParams = new URLSearchParams(account.body_template);

  // Replace only dynamic fields
  bodyParams.set("audio_cluster_id", audioId);
  bodyParams.set("original_sound_audio_asset_id", audioId);

  if (maxId) {
    bodyParams.set("max_id", maxId);
  } else {
    bodyParams.delete("max_id");
  }

  console.log(bodyParams);
  
  const response = await fetch(
    "https://www.instagram.com/api/v1/clips/music/",
    {
      method: "POST",
      headers,
      body: bodyParams.toString(),
    }
  );

  if (response.status === 401 || response.status === 403) {
    await markAccountFailed(account, "blocked");
    throw new Error("Instagram account blocked");
  }

  if (!response.ok) {
    await markAccountFailed(account, "failed");
    throw new Error(`Instagram error: ${response.status}`);
  }

  const rawText = await response.text();
  const cleaned = rawText.replace(/^for\s*\(;;\);\s*/, "");
  const data = JSON.parse(cleaned);
  const items = data.payload.items;
  
  const pagingInfo = data.payload.paging_info;
  const mediaCount = data.payload.media_count?.clips_count ?? 0;

  const mediaMetadata = data.payload.metadata?.music_info?.music_asset_info ?? data.payload.metadata?.original_sound_info ?? {};

  const coverImage = mediaMetadata.cover_artwork_uri ?? mediaMetadata.ig_artist?.profile_pic_url ?? "";
  const igUsername = mediaMetadata.ig_username ?? mediaMetadata.ig_artist?.username ?? "";
  const artistName = mediaMetadata.display_artist ?? mediaMetadata.ig_artist?.full_name ?? "";
  const soundDuration = mediaMetadata.duration_in_ms ?? 0;
  const soundUrl = mediaMetadata.progressive_download_url ?? "";
  const soundTitle = mediaMetadata.title ?? mediaMetadata.original_audio_title ?? "";
  const spotifyUrl = mediaMetadata.spotify_track_metadata?.spotify_listen_uri ?? "";

  const audioMetadata = {
    coverImage: coverImage,
    igUsername: igUsername,
    artistName: artistName,
    soundDuration: soundDuration,
    soundUrl: soundUrl,
    soundTitle: soundTitle,
    spotifyUrl: spotifyUrl
  };

  const reels = items.map((item: any) => {
    const media = item.media;
    const user = media.user;

    let mediaUrl: string | null = null;

    try {
      mediaUrl = media.video_versions[0].url;
    } catch {
      try {
        mediaUrl = media.image_versions2.candidates[0].url;
      } catch {
        mediaUrl = null;
      }
    }

    return {
      creator: user.username,
      views: media.play_count || 0,
      likes: media.like_count || 0,
      comments: media.comment_count || 0,
      post_url: `https://www.instagram.com/p/${media.code}/`,
      media_url: mediaUrl,
    };
  });

  return {
    reels,
    audioMetadata,
    maxId: pagingInfo.max_id || "",
    hasMore: pagingInfo.more_available || false,
    totalClips: mediaCount,
  };
}

/* ==========================
   EDGE HANDLER
========================== */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  if (req.method === "GET" && url.pathname.endsWith("/sessions")) {
    const { data, error } = await supabase
      .from("audio_scrape_sessions")
      .select("*")
      .order("last_updated", { ascending: true });

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch active sessions", details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ sessions: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { audioId, sessionId, restart } = (await req.json()) as RequestPayload;

    if (!audioId) {
      return new Response(JSON.stringify({ error: "audioId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let session: any = null;
    let newSession = false;

    const { data: existingSession } = await supabase
      .from("audio_scrape_sessions")
      .select("*")
      .eq("audio_id", audioId)
      .maybeSingle();

    if (existingSession) {
      session = existingSession;

      if ( restart ){
        session.max_id = "";
      }
    } 

    if (!session) {
      const token = `${audioId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { data: created } = await supabase
        .from("audio_scrape_sessions")
        .insert({
          audio_id: audioId,
          session_token: token,
          max_id: "",
          status: "active",
          total_posts: 0,
          scraped_posts: 0,
        })
        .select()
        .single();
      session = created;
      newSession = true;
    }

    let account;
    let igData;

    try {
      account = await getNextActiveAccount();
      igData = await fetchInstagramData(audioId, session.max_id || "", account);
      await markAccountUsed(account);
    } catch (err) {
      if (account) {
        await markAccountFailed(account, "failed");
      }
      throw err;
    }

    
    if ( igData.totalClips > 0 ) { //!session.total_posts && 
      await supabase
        .from("audio_scrape_sessions")
        .update({ total_posts: igData.totalClips })
        .eq("id", session.id);
      session.total_posts = igData.totalClips;
    }

    if ( restart || igData.audioMetadata.ig_username != "" ){
      const audioMetadata = igData.audioMetadata;    
      const { error: insertError } = await supabase
      .from("audio_metadata")
      .insert({
        audio_id: audioId,
        cover_image_url: audioMetadata.coverImage,
        ig_username: audioMetadata.igUsername,
        artist_name: audioMetadata.artistName,
        duration_ms: audioMetadata.soundDuration,
        sound_url: audioMetadata.soundUrl,
        sound_title: audioMetadata.soundTitle,
        spotify_url: audioMetadata.spotifyUrl, 
        id: session.id,
        last_updated: new Date().toISOString()
      });
    }

    for (const reel of igData.reels) {
      const { data: existing, error: selectError } = await supabase
        .from("audio_scrape_data")
        .select("id")
        .eq("session_id", session.id)
        .eq("post_url", reel.post_url)
        .maybeSingle();
    
      if (selectError) {
        continue;
      }
    
      if (!existing) {
        const { error: insertError } = await supabase
          .from("audio_scrape_data")
          .insert({
            session_id: session.id,
            audio_id: audioId,
            creator: reel.creator,
            post_url: reel.post_url,
            media_url: reel.media_url,
            views: reel.views,
            likes: reel.likes,
            comments: reel.comments,
          });
      } else {
        const { error: updateError } = await supabase
          .from("audio_scrape_data")
          .update({
            audio_id: audioId,
            creator: reel.creator,
            media_url: reel.media_url,
            views: reel.views,
            likes: reel.likes,
            comments: reel.comments,
          })
          .eq("id", existing.id);
      }
    }

    const newScrapedCount = session.scraped_posts + igData.reels.length;
    const shouldComplete = !igData.hasMore;

    const { data: allScrapedData } = await supabase
      .from("audio_scrape_data")
      .select("*")
      .eq("session_id", session.id);

    await supabase
      .from("audio_scrape_sessions")
      .update({
        max_id: igData.maxId,
        scraped_posts: allScrapedData.length,
        status: shouldComplete ? "completed" : "active",
        last_updated: new Date().toISOString(),
      })
      .eq("id", session.id);
    
    const metadata = {
      totalViews: allScrapedData?.reduce((sum, r) => sum + (r.views || 0), 0) || 0,
      totalLikes: allScrapedData?.reduce((sum, r) => sum + (r.likes || 0), 0) || 0,
      totalComments: allScrapedData?.reduce((sum, r) => sum + (r.comments || 0), 0) || 0,
      totalPosts: session.total_posts,
      scrapedPosts: allScrapedData.length,
      percentageScraped: session.total_posts > 0 ? Math.round((allScrapedData.length / session.total_posts) * 100) : 0,
    };

    return new Response(
      JSON.stringify({
        sessionId: session.session_token,
        hasMore: igData.hasMore,
        reels: igData.reels,
        audioMetadata: igData.audioMetadata,
        metadata,
        status: shouldComplete ? "completed" : "active",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch reels",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

