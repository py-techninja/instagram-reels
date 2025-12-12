import { Eye, Heart, MessageCircle, Zap } from 'lucide-react';
import CircularProgress from './CircularProgress';
import { AudioMetadata } from '../types';

interface AudioMetadataDisplayProps {
  metadata: AudioMetadata;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default function AudioMetadataDisplay({ metadata }: AudioMetadataDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Scraping Metadata</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <div className="flex justify-center">
          <CircularProgress
            percentage={metadata.percentageScraped}
            scrapedCount={metadata.scrapedPosts}
            totalCount={metadata.totalPosts}
          />
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase">Total Views</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatNumber(metadata.totalViews)}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-xs font-semibold text-red-600 uppercase">Total Likes</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatNumber(metadata.totalLikes)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase">Total Comments</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatNumber(metadata.totalComments)}</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-600 uppercase">Total Posts</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{metadata.totalPosts}</div>
        </div>
      </div>
    </div>
  );
}
