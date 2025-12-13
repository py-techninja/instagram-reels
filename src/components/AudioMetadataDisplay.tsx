import { Instagram, Music, ExternalLink } from 'lucide-react';
import { AudioMetadata } from '../types';

interface AudioMetadataDisplayProps {
  metadata: AudioMetadata;
}

const formatDuration = (ms?: number) => {
  if (!ms) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function AudioMetadataDisplay({ metadata }: AudioMetadataDisplayProps) {
  if (!metadata) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Audio Metadata
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Cover Image */}
        <div className="flex justify-center md:justify-start">
          {metadata.coverImage ? (
            <img
              src={metadata.coverImage}
              alt={metadata.soundTitle ?? 'Audio cover'}
              className="w-56 h-56 rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="w-56 h-56 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
              No cover image
            </div>
          )}
        </div>

        {/* Audio Info */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {metadata.soundTitle ?? 'Unknown title'}
            </h3>

            <p className="text-slate-600 mt-1">
              {metadata.artistName ?? 'Unknown artist'}
            </p>
          </div>

          {/* Meta rows */}
          <div className="space-y-2 text-sm">
            {metadata.igUsername && (
              <div className="flex items-center gap-2 text-slate-700">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>@{metadata.igUsername}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-700">
              <Music className="w-4 h-4 text-indigo-600" />
              <span>Duration: {formatDuration(metadata.soundDuration)}</span>
            </div>
          </div>

          {/* Audio Player */}
          {metadata.soundUrl && (
            <div className="pt-4">
              <audio
                controls
                className="w-full"
                src={metadata.soundUrl}
              />
            </div>
          )}

          {/* External links */}
          {metadata.spotifyUrl && (
            <div className="pt-3">
              <a
                href={metadata.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                Open on Spotify
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
