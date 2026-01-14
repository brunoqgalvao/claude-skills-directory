'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import { useUser } from './useUser'

export function useLike(skillId: string) {
  const { user } = useUser()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const supabase = createClient()

      // Get total likes count
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', skillId)

      setLikesCount(count || 0)

      // Check if current user liked
      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('skill_id', skillId)
          .eq('user_id', user.id)
          .single()

        setLiked(!!data)
      } else {
        setLiked(false)
      }

      setLoading(false)
    }

    fetchLikeStatus()
  }, [skillId, user])

  const toggleLike = useCallback(async () => {
    if (!user) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`
      return
    }

    const supabase = createClient()

    if (liked) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('skill_id', skillId)
        .eq('user_id', user.id)

      setLiked(false)
      setLikesCount((c) => c - 1)
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({ skill_id: skillId, user_id: user.id })

      setLiked(true)
      setLikesCount((c) => c + 1)
    }
  }, [liked, skillId, user])

  return { liked, likesCount, loading, toggleLike }
}
