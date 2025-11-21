import { ExternalLink, Eye, Heart, MessageCircle } from 'lucide-react';
import { Reel } from '../types';

interface ReelsTableProps {
  reels: Reel[];
}

export default function ReelsTable({ reels }: ReelsTableProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Creator
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Views
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Likes
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Comments
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Post
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {reels.map((reel, index) => (
            <tr key={index} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">@{reel.creator}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-700">{formatNumber(reel.views)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-700">{formatNumber(reel.likes)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-700">{formatNumber(reel.comments)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a
                  href={reel.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
