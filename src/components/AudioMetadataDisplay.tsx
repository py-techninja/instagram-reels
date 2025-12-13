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
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
        {/* Cover Image */}
        <div className="flex justify-center md:justify-start">
          {metadata.coverImage ? (
            <img
              src={metadata.coverImage}
              alt={metadata.soundTitle ?? 'Audio cover'}
              className="w-32 h-45 rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              No cover image
            </div>
          )}
        </div>

        {/* Audio Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 leading-tight">
              {metadata.soundTitle ?? 'Unknown title'}
            </h3>

            <p className="text-slate-600 text-sm">
              {metadata.artistName ?? 'Unknown artist'}
            </p>
          </div>

          {/* Meta rows */}
          <div className="space-y-1 text-sm">
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
            <audio
              controls
              className="w-full max-w-md mt-2"
              src={metadata.soundUrl}
            />
          )}

          {/* External links */}
          {metadata.spotifyUrl && (
            <a
              href={metadata.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 mt-1"
            >
              Open on Spotify
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
