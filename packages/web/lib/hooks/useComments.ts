'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import { useUser } from './useUser'

export interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  parent_id: string | null
  profile: {
    username: string | null
    display_name: string | null
    avatar_url: string | null
  } | null
  replies?: Comment[]
}

export function useComments(skillId: string) {
  const { user } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profile:profiles(username, display_name, avatar_url)
      `)
      .eq('skill_id', skillId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return
    }

    // Organize into tree structure
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create all comments
    data?.forEach((comment) => {
      const c = {
        ...comment,
        profile: Array.isArray(comment.profile) ? comment.profile[0] : comment.profile,
        replies: [],
      } as Comment
      commentMap.set(c.id, c)
    })

    // Second pass: organize into tree
    commentMap.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(comment)
        }
      } else {
        rootComments.push(comment)
      }
    })

    setComments(rootComments)
    setLoading(false)
  }, [skillId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!user) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`
      return null
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from('comments')
      .insert({
        skill_id: skillId,
        user_id: user.id,
        content,
        parent_id: parentId || null,
      })
      .select(`
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profile:profiles(username, display_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return null
    }

    // Refresh comments
    await fetchComments()

    return data
  }, [skillId, user, fetchComments])

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) return false

    const supabase = createClient()

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting comment:', error)
      return false
    }

    await fetchComments()
    return true
  }, [user, fetchComments])

  return { comments, loading, addComment, deleteComment, user }
}
