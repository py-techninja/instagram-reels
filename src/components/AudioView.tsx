import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { getAudioData } from "../../supabase/functions/instagram-scraper/index";
import MetadataDisplay from "./MetadataDisplay";
import ReelsTable from "./ReelsTable";

import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.get("SUPABASE_URL") || "",
  process.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

export async function getAudioData(audioId: string) {
  const { data: session } = await supabase
    .from("audio_scrape_sessions")
    .select("*")
    .eq("audio_id", audioId)
    .maybeSingle();

  if (!session) return null;

  const { data: reels } = await supabase
    .from("audio_scrape_data")
    .select("*")
    .eq("audio_id", audioId)
    //.eq("session_id", session.id)
    .order("views", { descending: true });

  const metadata = {
      totalViews: reels?.reduce((sum, r) => sum + (r.views || 0), 0) || 0,
      totalLikes: reels?.reduce((sum, r) => sum + (r.likes || 0), 0) || 0,
      totalComments: reels?.reduce((sum, r) => sum + (r.comments || 0), 0) || 0,
      totalPosts: session.total_posts,
      scrapedPosts: reels.length,
      percentageScraped: session.total_posts > 0 ? Math.round((reels.length / session.total_posts) * 100) : 0,
  }
  return {
    metadata: metadata,
    reels: reels || [],
  };
}


export default function AudioView() {
  const { audioId } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (id: string) => {
    setLoading(true);
    const res = await getAudioData(id);
    setLoading(false);

    if (!res) {
      setError("No data found for this audio ID.");
      setMetadata(null);
      setReels([]);
      return;
    }

    setError("");
    setMetadata(res.metadata);
    setReels(res.reels);
  };

  useEffect(() => {
    if (audioId) {
      setInput(audioId);
      fetchData(audioId);
    }
  }, [audioId]);

  const search = () => {
    if (!input.trim()) return;
    navigate(`/audio/${input.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Audio Reels Viewer</h1>

        <div className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Audio ID"
            className="flex-1 px-4 py-3 border rounded-lg"
          />
          <button
            onClick={search}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {metadata && (
          <>
            <MetadataDisplay metadata={metadata} />
            <div className="mt-6 bg-white rounded-lg shadow-sm">
              <ReelsTable reels={reels} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
