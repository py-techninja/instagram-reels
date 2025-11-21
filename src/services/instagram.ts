import { FetchReelsResponse } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchReels(
  audioId: string,
  sessionId?: string,
  restart?: boolean
): Promise<FetchReelsResponse> {
  const apiUrl = `${SUPABASE_URL}/functions/v1/instagram-scraper`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioId,
      sessionId,
      restart,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch reels');
  }

  return await response.json();
}
