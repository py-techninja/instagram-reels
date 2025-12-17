import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COOKIE = "ig_did=2586E831-2514-4530-89A7-EC88517C72D2; datr=4re2aF7ZsZw2MgPseyjelLpO; ig_nrcb=1; mid=aOLpjgALAAG9tEdm0Tc6KhtJCCTy; ps_l=1; ps_n=1; dpr=1.25; csrftoken=xxi90HCa8lUIeuAJCoVsVZXmZcfEiMO1; ds_user_id=58402963693; sessionid=58402963693%3AtSxi9LoWnCwpRu%3A10%3AAYgRxsGTKlmXoXBwwDFW80rDGmhsMsRpvniPyxvEQA; wd=982x695;"
  
function cors(req: Request) {
  const headers = new Headers();

  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
 
  const requestHeaders = req.headers.get("Access-Control-Request-Headers");
  if (requestHeaders) {
    headers.set("Access-Control-Allow-Headers", requestHeaders);
  }

  return headers;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

interface RequestPayload {
  audioId: string;
  sessionId?: string;
  restart?: boolean;
}

interface Reel {
  creator: string;
  followers: number;
  views: number;
  likes: number;
  comments: number;
  post_url: string;
  media_url: string | null;
}

interface ScrapedData {
  reels: Reel[];
  maxId: string;
  hasMore: boolean;
  totalClips: number;
}

async function fetchInstagramData(audioId: string, maxId: string): Promise<ScrapedData> {
  const formData = new URLSearchParams({
    audio_cluster_id: audioId,
    original_sound_audio_asset_id: audioId,
    max_id: maxId ?? "",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "o",
    __hs: "20439.HCSV2:instagram_web_pkg.2.1...0",
    dpr: "1",
    __ccg: "MODERATE",
    __rev: "1031209824",
    __s: "mzxblu:kahoip:vcg6ey",
    __hsi: "7584892948126069921",
    __dyn:
      "7xeUjG1mxu1syUbFp41twWwIxu13wvoKewSAwHwNw9G2S7o2vwa24o0B-q1ew6ywaq0yE462mcw5Mx62G5UswoEcE7O2l0Fwqo31w9O1lwxwQzXwae4UaEW2G0AEco5G1Wxfxm16wUwtE1wEbUGdG1QwTU9UaQ0Lo6-3u2WE5B08-269wr86C1mgcEed6hEhK2O4Xxui2qi7E5y4UrwHwGwa6bBK4o1lUG3a18whE984O",
    __csr:
      "gh8pPMJtiihk9M_NlihBZh4JZNaR4imAyp5jsx2lhSCKJBpvlmHBmiaiKF6Vd9HKl2aKFEAJ948QHHGGzp9ojCUSGKIBKuESGx68DhKUx1jXDUymQip6BUqx6aG6FQGBCKK6EhzEqGEDUWdF3oiiDGeAyUKv-jGWx6tqK59UzZ2UOpppbzqJkhyZ5l1SdwzGaxKazu58izUqxm0gm00lZKFoa81ZHG58uxqaw2d4u8gK7Uhw4pAUby2303qFUy9w3M83Qw1oow1Qbxe2B3Etyul0h84hxdwwwOBo4G0EE1Lpmi1om0j-1ZP0q82bwh64oak2yUhg1Xmm1bcew3hwIaN8mUbbwPw5Lw0gDE14U0baU7S09Bo0Iq0h3w1q2",
    __hsdp:
      "gR2N0_1swh0CjscNQan9SRf2h7JIriAEkmD6nEFmp78-hRLP2avPe2F2Fohoy5xbF0p20_hlwHQ6hwx3m4C68Aw4C3W7o9mp4wwUuwfm4U9HgieaxWm0AQi261pVo3qwn8mCzEnxGiEuUpyUdEy1UwZwxwCyoWu08Hw3z825weS0QUsweO3O1Yx64E3hxa0mK0VU7O09mw50w9J09m1oxK1o84E3xw",
    __hblp:
      "0nU7uaK6o6K2C213-1VwIwAwUw_BDzHwTxuBxmU8EK13wg-dwh99Emxi10wrQ1dzXxGagixnzoPBDwm8y2B4wxwyyUgxDByEjwaaElzEG12xqqEK9zoqAG7lyo-mm4ojx28whUc8K36-6U9ECeDx61Dw6Nwl819E2zwfy1Pw8m0Ao5K1dwh8S3a783Hgf87O4oiz85C1Rw-w4Qweu1Ywoo1WUybwt85C7U4m3O3G2d0r8a84OagkCxm7UqD88Gq5E3awnU4m",
    __sjsp:
      "gR2N0_1swh0CjscNQan9SRffkV7JIriAEkmD6nEFmq88-hQm4oyawSwgrF0p20hBwi1wCdoigpwlEfE",
    __comet_req: "7",
    fb_dtsg:
      "NAfvt5UjsUEJLC7e5da37KQqqqWzOPXMpaXKU_KZlA8wf9vXYBbJAqQ:17865068956001195:1765477512",
    jazoest: "26299",
    lsd: "cdqfXOYuQG1ioiu7OZYcm4",
    __spin_r: "1031209824",
    __spin_b: "trunk",
    __spin_t: "1765995507",
    __crn: "comet.igweb.PolarisClipsAudioRoute",
  });



  const response = await fetch("https://www.instagram.com/api/v1/clips/music/", {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "priority": "u=1, i",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      "sec-ch-ua-full-version-list":
        '"Chromium";v="142.0.7444.176", "Google Chrome";v="142.0.7444.176", "Not_A Brand";v="99.0.0.0"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-asbd-id": "359341",
      "x-fb-lsd": "Iarr4VRK-cx4Wex3XHyt5L",
      "x-ig-d": "www",
      cookie: COOKIE,
      Referer: `https://www.instagram.com/reels/audio/${audioId}`,
    },
    body: formData.toString(),
  });


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
  
  const reels: Reel[] = items.map((item: any) => {
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
      followers: 0,
      views: media.play_count || 0,
      likes: media.like_count || 0,
      comments: media.comment_count || 0,
      post_url: `https://www.instagram.com/p/${media.code}/`,
      media_url: mediaUrl,
    };
  });

  return {
    reels,
    audioMetadata: audioMetadata,
    maxId: pagingInfo.max_id || "",
    hasMore: pagingInfo.more_available,
    totalClips: mediaCount,
  };
}

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

    const igData = await fetchInstagramData(audioId, session.max_id || "");

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
