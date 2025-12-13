import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COOKIE = 'ig_did=2586E831-2514-4530-89A7-EC88517C72D2; datr=4re2aF7ZsZw2MgPseyjelLpO; ig_nrcb=1; csrftoken=wtadSWmqz7dpHSG6xj0ahQY7H8YvaOMM; mid=aOLpjgALAAG9tEdm0Tc6KhtJCCTy; ds_user_id=58402963693; ps_l=1; ps_n=1; dpr=1.25; sessionid=58402963693%3AW854N5lOAlJsTk%3A1%3AAYgFNVEZLRj85BcF5PkpZX7_e7PRpCEQql4Hz7MlYQ; rur="LLA\05458402963693\0541796714759:01fe12ae70102697dda4255381d01c6290591abfda435cc53c4c18e079d424e1ab54da7d"; wd=982x695';

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
    __req: "2",
    __hs: "20430.HCSV2:instagram_web_pkg.2.1...0",
    dpr: "1",
    __ccg: "MODERATE",
    __rev: "1030747366",
    __s: "w7qfzh:vd58o7:2v7rdz",
    __hsi: "7581385849405336921",
    __dyn: "7xe6E5q5U5ObwKBAg5S1Dxu13wvoKewSAwHwNwcy0Lo2wx609vCwjE1EE2Cw8G11w6zx61vwoEcE7O2l0Fw4Hw9O0M82zxe2GewGw9a361qw8W1uwUw7VwLyES1TwTwFwIwbS1LwTwKG1pg2Xwr86C1mg6LhAq4rwgbxui2K7E5y4UrwHwcObBK4o1oEcE2fwAw",
    __csr: "g8Z_kn92mPthcnkLRFtV5ZRszAmFRswR6Kh25Jdy8ymazeV5zonFaWGaV5AUCFpGQipah5BiACVu98c-i8Bjx3WUqzkdAKtaaz4E9a-u8GdFoyF8yiVoKcGu4-XFKlCDK5A8DCCxiuiqu69eoB6xy58CmUzAAwxBzo-qt6z4EjzaADzHAKbg20w05r1Bwq81qz01b23i9GSHSewuk0C9CuUnU2Kwe61_xa682SU6O0gS0om067i03eo4Ux5w3OoJG4Q5VQm1FwaIOxd1q5Gdong9Eiwg89CbDzkt0tUlhBysE3mwmUMapxywExy4o1z81oE06TW09oyoK0hu06cUbU0uyw53w",
    __hsdp: "l0XV2POE2Qks2oNtDexqhCBJykU9Qh1n8CtdO4gkgZy4NDLo4gMaS3jeB43Q3xwiUiF7waasw2cgK4F8KUiogxR0Jieii0O86C1hVFF8hxq0Co46bxS7Ef8mDBCyoS1mU8U6q3C684u6o3-w2W8co1qo3Zg3mw4Axm2G0M99U1L82MwvE0xC0KA1fw4wwkoS361pa0NU",
    __hblp: "08i0Oo38w4Bw_CCxW7E2dxe1kx2dV8KUvF0BwKyQ7V8a8hw82bgeobUcUtQmqi4ry9Gw9C11DK6-7Eozolxqumq9y987Pwg9rzoK3C684u5J4w921Ew49wno19o5B1-4oa87i0OU3RDg3mwb21wxa5oaEgwQwsFV9U560mG0I87W1zw6LBxi2-1ewCgK13wcq1jAgkx62Gcgb-um16Aa4Uy0GE523C",
    __sjsp: "kI8QwgJlOtAB2eayK4e2C45pAlJ2Q2NetxpkbglAwDh46k4EcA6FS0lC",
    __comet_req: "7",
    fb_dtsg: "NAfsFwJ96eZh3x7yoSyiVQ6qbqIaQO0xLJHfw642mOZV02zVMnRd-HQ:17864863018060157:1763990499",
    jazoest: "26215",
    lsd: "QdJ42l9kP0QoY1M7zGlEb6",
    __spin_r: "1030747366",
    __spin_b: "trunk",
    __spin_t: "1765178947",
    __crn: "comet.igweb.PolarisClipsAudioRoute"
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
  
  const mediaCount = data.payload.media_count?.clips_count || 0;

  const mediaMetadata = data.payload.metadata?.music_info.music_asset_info || {};

  const coverImage = mediaMetadata.cover_artwork_uri;
  const igUsername = mediaMetadata.ig_username;
  const artistName = mediaMetadata.display_artist;
  const soundDuration = mediaMetadata.duration_in_ms;
  const soundUrl = mediaMetadata.progressive_download_url;
  const soundTitle = mediaMetadata.title;
  const spotifyUrl = mediaMetadata.spotify_track_metadata?.spotify_listen_uri;

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

    if (!session.total_posts && igData.totalClips > 0) {
      await supabase
        .from("audio_scrape_sessions")
        .update({ total_posts: igData.totalClips })
        .eq("id", session.id);
      session.total_posts = igData.totalClips;
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
