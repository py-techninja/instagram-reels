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
    __req: "4",
    __hs: "20435.HCSV2:instagram_web_pkg.2.1...0",
    dpr: "1",
    __ccg: "MODERATE",
    __rev: "1031048183",
    __s: "e07h2u:155o8j:406d39",
    __hsi: "7583263477445038855",
  __dyn: "7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJxS0DU2wx609vCwjE1EE2Cw8G11wBz81s8hwGxu786a3a1YwBgao6C0Mo2swlo8od8-U2zxe2GewGw9a361qwuEjUlwhEe87q0oa2-azqwt8d-2u2J0bS1LwTwKG1pg2fwxyo6O1FwlA3a3zhAq4rwIxeUnAwCAxW1oxe6UaU3cyVrx60ma3a18whE984O",
    __csr: "gR9dsO1R5Y-OMJnbGCJ49OclGJlTEyP8C9mACnh94miRJnWx6qp5ggpFVWGp3Vp8xBWXF3pW-CmLBDBCAXyp9FVECtaSaBhGJ3886XCizbhFEG9AhQbzogxDDAwwGFUtLtqzvyWHzUGiFF-cx7zEkyGGm89VUDg9bxfGqh4jCy994ufGbyay4uA6V8Sm8xSqcwl-7o199U01oikU5W587qdg9U1Fo4258iLo3mgiG26h0HnJ7zE9k0b8g0iyU6K0he04oEgo0HClwxwrEUxawc22i5Q7U96lj02Qo1bVCi5z09O0H92S0Uy0Cw8bOw1kGU760CohNowb00i0o0bOEsw2i60VE0mZw1WO",
    __hsdp: "l0AA1pE4g9xyW2ckTkheYY9iP4nhHmGEZ5igxi4e4kbGia8SAUF3QzkkEaAdl2ph05x1wwb61eIom6S2xaA7y38fEpwOAxhy45aggwtEcPy47EbUbU6q0gG323amdAxq68twfy26bgrKawDwEUO2OeyUa84y10y82ywaS08Bg0Ny0mGawoUdUrwqE6F0vu0l60Po29w24o1TA1rwqE6y68hxm5-3O",
    __hblp: "0di1XwmUjzU6O0xU3hwOK12wBBhUa88-fDz84u2Wqag-3-9yUpwLzU8o-2ii0ME43wMDxK9ABzrgmzUy7o2wwkF88ppk6XyFUvxCeUO2OeyUrz8aEtBwWy82ywaS68620qJ09O3S0xE1JE2fwBwoVU4yazU5e9xG4ErzE5DwqA1lwk81aE3dw8C3W0sC8w821WAwmU5W290mU4q27y8swDxGq44aBjx64XUf85m0EU",
    __sjsp:
      "l0AA1pE4g9xyW2ckTkheYY8EJmht6JqGzQl9258hi153F8GbgV1G14K1Lgo82Nwkxxoroa41QxC",
    __comet_req: "7",
    fb_dtsg:
      "NAfvyBkocIQUkMwarN82iqf3i2sU6N5RPGsBag-DIx9XpzfE1YRjIsw:17865068956001195:1765477512",
    jazoest: "26352",
    lsd: "lG1jlx6c2IZJWIZin5Rv7-",
    __spin_r: "1031048183",
    __spin_b: "trunk",
    __spin_t: "1765616116",
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

  const mediaMetadata = data.payload.metadata?.music_info?.music_asset_info || {};

  const coverImage = mediaMetadata.cover_artwork_uri;
  const igUsername = mediaMetadata.ig_username;
  const artistName = mediaMetadata.display_artist;
  const soundDuration = mediaMetadata.duration_in_ms;
  const soundUrl = mediaMetadata.progressive_download_url;
  const soundTitle = mediaMetadata.title;
  const spotifyUrl = mediaMetadata.spotify_track_metadata?.spotify_listen_uri;

  const audioMetadata = {
    coverImage,
    igUsername,
    artistName,
    soundDuration,
    soundUrl,
    soundTitle,
    spotifyUrl
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
    audioMetadata: mediaMetadata ? audioMetadata : null,
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

    if ( igData.audioMetadata ){
      const audioMetadata = igData.audioMetadata;    
      const { error: upsertError } = await supabase
      .from("audio_metadata")
      .insert({
        audio_id: audioId,
        cover_image_url: coverImage,
        ig_username: igUsername,
        artist_name: artistName,
        duration_ms: soundDuration,
        sound_url: soundUrl,
        sound_title: soundTitle,
        spotify_url: spotifyUrl, 
        id: session.id,
        last_updated: new Date().toISOString()
      });
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
