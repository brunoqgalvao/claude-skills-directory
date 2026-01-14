'use client'

import { useLike } from '@/lib/hooks'
import { HeartIcon } from 'lucide-react'

interface LikeButtonProps {
  skillId: string
}

export default function LikeButton({ skillId }: LikeButtonProps) {
  const { liked, likesCount, loading, toggleLike } = useLike(skillId)

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${liked
          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <HeartIcon
        className={`w-4 h-4 transition-all ${liked ? 'fill-current' : ''}`}
      />
      <span>{likesCount}</span>
    </button>
  )
}
