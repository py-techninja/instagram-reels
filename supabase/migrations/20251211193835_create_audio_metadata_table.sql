/*
  # Create audio_metadata table

  1. New Tables
    - `audio_metadata`
      - `audio_id` (text, primary key) - unique audio identifier
      - `cover_image` (text, nullable) - URL to album artwork
      - `ig_username` (text, nullable) - Instagram username of the sound creator
      - `artist_name` (text, nullable) - Display name of the artist
      - `sound_duration` (integer, nullable) - Duration in milliseconds
      - `sound_url` (text, nullable) - Download URL for the sound
      - `sound_title` (text, nullable) - Title of the sound
      - `spotify_url` (text, nullable) - Spotify URI link
      - `updated_at` (timestamp) - Last updated timestamp

  2. Security
    - Enable RLS on `audio_metadata` table
    - Add policy to allow anyone to read audio metadata
*/

CREATE TABLE IF NOT EXISTS audio_metadata (
  audio_id text PRIMARY KEY,
  cover_image text,
  ig_username text,
  artist_name text,
  sound_duration integer,
  sound_url text,
  sound_title text,
  spotify_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE audio_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read audio metadata"
  ON audio_metadata
  FOR SELECT
  USING (true);
