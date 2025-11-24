import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COOKIE = "ig_did=2586E831-2514-4530-89A7-EC88517C72D2; datr=4re2aF7ZsZw2MgPseyjelLpO; ig_nrcb=1; csrftoken=wtadSWmqz7dpHSG6xj0ahQY7H8YvaOMM; mid=aOLpjgALAAG9tEdm0Tc6KhtJCCTy; ds_user_id=58402963693; ps_l=1; ps_n=1; dpr=1.25; wd=767x695; sessionid=58402963693%3AAiYAdP80kSoqaB%3A21%3AAYjpw0xQKPpFDc6vG-TtMNKpuzXK2TUH2PmatwfhaA";

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
    max_id: maxId,
    original_sound_audio_asset_id: audioId,
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "t",
    __hs: "20413.HYP:instagram_web_pkg.2.1...0",
    dpr: "1",
    __ccg: "GOOD",
    __rev: "1030194711",
    __s: "gwwdg5:sji9on:v7yh50",
    __hsi: "7574980451503834908",
    __dyn: "7xeUjG1mxu1syUbFp41twWwIxu13wvoKewSAwHwNw9G2S7o2vwa24o0B-q1ew6ywaq0yE462mcw5Mx62G5UswoEcE7O2l0Fwqo31w9O1lwxwQzXwae4UaEW2G0AEco5G1Wxfxm16wUwtE1wEbUGdG1QwTU9UaQ0Lo6-3u2WE5B08-269wr86C1mgcEed6goK2O4Xxui2qi7E5y4UrwHwGwa6bBK4o1lUG3a13AwhE98",
    __csr: "g84ahAAROZMz7h2R4R5hlRilnW9tdQH3HsFUzRWJ8CAUyoDz45KKmESi8AhbAChplXl4jFDihqxdGFFVoGqbzFF8SuqECt9xF1a4lp9qBKqqqHGi8-8xbgjypX-9Ui8mucGq8_CKcxl6gy4GAyHyodVeBTyZ5y9aCz8x2HUnyokjV4uq9xCUx2o8o1pE01oPU-awp9Vi0EwDxC0MC0Raa2i7E1fuRBzEG1kg5u5A5o8o0OKu048K0_o3dw3qdw2qEkN61awBg2io-5Z6wLxsw3Ug1wBxYw1085S0g-gE720I4EjgmS0Qo3DYEeS05A42F0XwQAw0sOUrw3EC08Kw0Qgwa2",
    __hsdp: "n0kynk5I4xk2WkAQyq4GXa2mijjQJzamhPF98mg8Gy3BAPkdflx4y8iO1HaE4gwCqGe8N9k3S1kwMQ8x8xU22wxwEBym6O1W3Wfeh0a61GxC222Kq0jyqm2a2K4Enz8WcyFUa9FFE3kyo4GUy1mBw4-whopw3Vovw4Iw5QwBCwdK1-wXzo5C0vm0Po7m09Qw4mwrA1Hwfm584wwN0",
    __hblp: "0uV83pGi4E56dwNyWzK3O1IyUC0y8oxep6AWwzzFE4W3KqcwGBgcA22i3qA1YwDxu9zE4248pGq4WwHCxy0L8vzWwLAQi2a6Egxa5XybyEyUGu2yqqq0R8C1nwBzpUqBwkE2-wIwDxS6o0yq0rW7UfEpwno62582twdq2mq0SUdE4u3KdwDz8W5o7-4UaU1do3dwto2tw7gBwi8662q14xS1ggqyod8hws9UO2G4oaVFpuq442-owN0mE37w",
    __sjsp: "n0jYynkh1918l0KB9d8CDaHIE9p9dfiScFp7eAAxhgyG8eGjdgQZm4i5AIwqwk8C1Gwl8",
    __comet_req: "7",
    fb_dtsg: "NAfsaur_Fm-sUY_8q5GwORL6IyTLtsJnDBjs9pgB37xbS8JPwp6K_5A:17843696212148243:1761052643",
    jazoest: "26264",
    lsd: "ubYXSYTgRimNpAR3gGSAzK",
    __spin_r: "1030194711",
    __spin_b: "trunk",
    __spin_t: "1763687574",
    __crn: "comet.igweb.PolarisClipsAudioRoute",
  });

  const response = await fetch("https://www.instagram.com/api/v1/clips/music/", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "priority": "u=1, i",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      "sec-ch-ua-full-version-list": '"Chromium";v="142.0.7444.163", "Google Chrome";v="142.0.7444.163", "Not_A Brand";v="99.0.0.0"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-asbd-id": "359341",
      "x-fb-lsd": "ubYXSYTgRimNpAR3gGSAzK",
      "x-ig-d": "www",
      "cookie": COOKIE,
      "Referer": "https://www.instagram.com/reels/audio/1031472805651370?igsh=MnkwODUwZ25mNmtp",
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
      .order("last_updated", { ascending: false });

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
