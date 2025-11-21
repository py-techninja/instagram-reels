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
    __req: "2",
    __hs: "20410.HYP:instagram_web_pkg.2.1...0",
    dpr: "1",
    __ccg: "MODERATE",
    __rev: "1030040670",
    __s: "dxwz8d:h9ut6m:ioizb7",
    __hsi: "7574084181476789634",
    __dyn: "7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJxS0DU2wx609vCwjE1EE2Cw8G11wBz81s8hwGxu786a3a1YwBgao6C0Mo2swlo8od8-U2zxe2GewGw9a361qwuEjUlwhEe87q0oa2-azqwt8d-2u2J0bS1LwTwKG1pg2fwxyo6O1FwlA3a3zhA6bwIxeUnAwCAxW1oxe6UaU3cyVrx60ma3a13AwhE98",
    __csr: "grOOML2lEV28Rli_vRkWdbJ4t94LQZdaBWlpe-FeGKKn-AmiKV4_x4w8ki8hJeFvy8y4kGDKq9AG5t5jiFUBG8-FbAyGyotUK8yF9XV8y9VmXVHyV4QHF1x6BK26aG8AxCF4i5pQmGXgkAByby_goVJZmey9pp8-ax2u5oKbBWLyKFfzk4oJ3FWyEfA3q6UrBwXCwv8gyiTrhF6mACiaoxrg01mTE7Klwfd0tUS9yEfo1opQ0_UeE4epQ0OptaIwO7Q3K6U0HF015uEow25o0gz80vi23J64xqC0wC4pUx1i0PE5B06hm0DU5alw4PIE1kVYM15U2ayj09hw3wE21g1BHz807zOfwt60esw0PCw7_w",
    __hsdp: "l0XhY5V42oaOL1i9L9qcIBZlCvDp42iiFfioj8HUFG8711Dxidwhz9wh6x2GN0B0ho24J2E8o7y68v8tCmaCBwso495z3w9u1NxW2O4Uaoy0VUmxq2m4UyfxF122p4wBwhUtwQyEgAyGw3p83byE1n8swXw8m0lJ0h81A8vwKwYw860sm0N87W0aKwlk0l2y0Jwee0z8",
    __hblp: "0820QU5C0wU5S0IU4ap0ioswlo4249Ey5rz9Ec842m3mdwBwPQ3m5U9o4KuuewIALhWwCy83DDzEmxyUy4XAzUoQ489Ai2m6obotxuczUG22Eb85C09AwkU983bDG0lO788opw8m0lJ0h8uwXwEx61sw8y58vwxz8f9Udo4e2K0pC0N87W1lw4Sw9O0x8uwSgG18wca6VU-my0yyE5m4E6y4pEym1rxG1iwHw",
    __sjsp: "l0XhY5V42oaRjMz2UCYBEORTRmp-tAg99aAZ9xcyLyQEws462G0py",
    __comet_req: "7",
    fb_dtsg: "NAfuKtFJJMcpI3RqVUcPXCY44LCQ1jm2wth6tAJkt-UI8Tycm3NWEPQ:17843696212148243:1761052643",
    jazoest: "26121",
    lsd: "8l9nBYuE57sFHfJe4pkNf1",
    __spin_r: "1030040670",
    __spin_b: "trunk",
    __spin_t: "1763478895",
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
      "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      "sec-ch-ua-full-version-list": '"Google Chrome";v="141.0.7390.123", "Not?A_Brand";v="8.0.0.0", "Chromium";v="141.0.7390.123"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-ch-ua-platform-version": "\"15.0.0\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-asbd-id": "359341",
      "x-fb-lsd": "8l9nBYuE57sFHfJe4pkNf1",
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

    if (sessionId && !restart) {
      const { data: existingSession } = await supabase
        .from("audio_scrape_sessions")
        .select("*")
        .eq("session_token", sessionId)
        .maybeSingle();

      if (existingSession) {
        session = existingSession;
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
      // 1. Check if record exists
      const { data: existing, error: selectError } = await supabase
        .from("audio_scrape_data")
        .select("id") // just need primary key
        .eq("session_id", session.id)
        .eq("post_url", reel.post_url)
        .maybeSingle();
    
      if (selectError) {
        //console.error("Select error:", selectError);
        continue;
      }
    
      if (!existing) {
        // 2. If not exists → INSERT
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
    
        //if (insertError) console.error("Insert error:", insertError);
      } else {
        // 3. If exists → UPDATE
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
    
        //if (updateError) console.error("Update error:", updateError);
      }
    }


    const newScrapedCount = session.scraped_posts + igData.reels.length;
    const shouldComplete = !igData.hasMore;

    await supabase
      .from("audio_scrape_sessions")
      .update({
        max_id: igData.maxId,
        scraped_posts: newScrapedCount,
        status: shouldComplete ? "completed" : "active",
        last_updated: new Date().toISOString(),
      })
      .eq("id", session.id);

    const { data: allScrapedData } = await supabase
      .from("audio_scrape_data")
      .select("*")
      .eq("session_id", session.id);

    const metadata = {
      totalViews: allScrapedData?.reduce((sum, r) => sum + (r.views || 0), 0) || 0,
      totalLikes: allScrapedData?.reduce((sum, r) => sum + (r.likes || 0), 0) || 0,
      totalComments: allScrapedData?.reduce((sum, r) => sum + (r.comments || 0), 0) || 0,
      totalPosts: session.total_posts,
      scrapedPosts: newScrapedCount,
      percentageScraped: session.total_posts > 0 ? Math.round((newScrapedCount / session.total_posts) * 100) : 0,
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
