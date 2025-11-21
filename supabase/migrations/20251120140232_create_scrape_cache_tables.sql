/*
  # Create Instagram Audio Scrape Cache Tables

  1. New Tables
    - `audio_scrape_sessions`
      - `id` (uuid, primary key) - unique session identifier
      - `audio_id` (text) - Instagram audio ID
      - `session_token` (text, unique) - token to identify scrape session
      - `max_id` (text) - pagination cursor for resuming
      - `status` (text) - active, paused, completed, failed
      - `total_posts` (integer) - total clips_count from Instagram
      - `scraped_posts` (integer) - number of posts scraped so far
      - `last_updated` (timestamptz) - last scrape time
      - `expires_at` (timestamptz) - cache expiration (2 hours)
      - `created_at` (timestamptz)

    - `audio_scrape_data`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key) - references audio_scrape_sessions
      - `audio_id` (text) - for querying
      - `creator` (text)
      - `post_url` (text, unique per session/creator combo)
      - `media_url` (text, nullable)
      - `views` (integer)
      - `likes` (integer)
      - `comments` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access (data is aggregated)
    - No write access from public (only server-side via edge functions)

  3. Indexes
    - audio_id for faster lookups
    - session_id for joining
    - expires_at for cleanup queries
*/

CREATE TABLE IF NOT EXISTS audio_scrape_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_id text NOT NULL,
  session_token text UNIQUE NOT NULL,
  max_id text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
  total_posts integer DEFAULT 0,
  scraped_posts integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '2 hours'),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audio_scrape_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES audio_scrape_sessions(id) ON DELETE CASCADE,
  audio_id text NOT NULL,
  creator text NOT NULL,
  post_url text NOT NULL,
  media_url text,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audio_scrape_sessions_audio_id ON audio_scrape_sessions(audio_id);
CREATE INDEX IF NOT EXISTS idx_audio_scrape_sessions_expires_at ON audio_scrape_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audio_scrape_data_audio_id ON audio_scrape_data(audio_id);
CREATE INDEX IF NOT EXISTS idx_audio_scrape_data_session_id ON audio_scrape_data(session_id);

ALTER TABLE audio_scrape_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_scrape_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scrape sessions"
  ON audio_scrape_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read scrape data"
  ON audio_scrape_data FOR SELECT
  TO public
  USING (true);
