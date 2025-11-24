import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COOKIE = 'ig_did=2586E831-2514-4530-89A7-EC88517C72D2; datr=4re2aF7ZsZw2MgPseyjelLpO; ig_nrcb=1; csrftoken=wtadSWmqz7dpHSG6xj0ahQY7H8YvaOMM; mid=aOLpjgALAAG9tEdm0Tc6KhtJCCTy; ds_user_id=58402963693; ps_l=1; ps_n=1; dpr=1.25; wd=982x695; sessionid=58402963693%3AW854N5lOAlJsTk%3A1%3AAYjBt5y0gQpPe6gEOfdgHrx4uA3CmXAbl5oLHkCxkQ; rur=\"LLA\\05458402963693\\0541795526525:01fec05cc49f1a8b0b5a2d296fedc8683545e3fb66201fece4bd3f7ae9c526615386b959\"';

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
  __req: "s",
  __hs: "20413.HYP:instagram_web_pkg.2.1...0",
  dpr: "1",
  __ccg: "MODERATE",
  __rev: "1030297849",
  __s: "jkifl1:p73g6b:l3d0j3",
  __hsi: "7576281594781178042",
  __dyn: "7xeUjG1mxu1syUbFp41twWwIxu13wvoKewSAwHwNw9G2S7o2vwa24o0B-q1ew6ywaq0yE462mcw5Mx62G5UswoEcE7O2l0Fwqo31w9O1lwxwQzXwae4UaEW2G0AEco5G1Wxfxm16wUwtE1wEbUGdG1QwTU9UaQ0Lo6-3u2WE5B08-269wr86C1mgcEed6hEhK2O4Xxui2qi7E5y4UrwHwGwa6bBK4o1lUG3a13AwhE98",
  __csr: "gGwbkl4RPhrkAnFYjbkACzbf8zc_dtjaFl8GIJrQGBV6V8CECiHihVFnF9by9oZkKEGpGaGZ4yeiQh3J7gWhoGqmEqpoSlbyovXK8zF8CGVerGmKnBKryvyA-cKa8cyppuiWUCFFkXHZ2WwQgyaBK2DBzoN5BgS9Cy8Cu4ppEO4ESh2-fDx2dBwGGEN164998hxvw05AUxiaK6E4V0DDCw7uA9wzCw5jL9x2RJ09l0n8C07rqwcW0_E0Sow0CS52122B3Esgy8w8BxGco4uc80-k0nKh0By8x04iwio3nqxd0920GYg0hO0CEaYEfoy8w1h60DQ2FwMxG01P-Bw3w8b8iw2b80dZoG",
  __hsdp: "gfG182EcMzL2QdCHANh3iQAUBa2sJoKXYjFcpfFndMGpNx8i8bJCG2Nyz0gFPyt8gA3i1uyEfO13gaEsx5o4u12gylDqwg8S0R8s4w46wgUK2e22aw_yU2qwNxaq2664u365EG4898F0so5B7xW0rbwkE0Ge1gzU0xp05Dw9Kawv8W1kw22o3owr80D60gW0z41JwaO1rokK1pg",
  fb_dtsg: "NAfufSMY3VoYkYZkYisj5yFhmXzjvVM3MBCkgNyiwYtuEFq-h2kILGQ:17864863018060157:1763990499",
  jazoest: "26527",
  lsd: "Iarr4VRK-cx4Wex3XHyt5L",
  __spin_r: "1030297849",
  __spin_b: "trunk",
  __spin_t: "1763990520",
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
  
  const mediaCount = data.payload.media_count?.clips_count || 0;

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
