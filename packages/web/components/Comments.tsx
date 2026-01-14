'use client'

import { useComments, type Comment } from '@/lib/hooks'
import { useState } from 'react'
import { MessageCircle, Trash2, Reply } from 'lucide-react'

interface CommentsProps {
  skillId: string
}

function CommentItem({
  comment,
  onDelete,
  onReply,
  currentUserId,
  depth = 0,
}: {
  comment: Comment
  onDelete: (id: string) => void
  onReply: (parentId: string) => void
  currentUserId?: string
  depth?: number
}) {
  const isOwner = currentUserId === comment.user_id
  const displayName = comment.profile?.display_name || comment.profile?.username || 'Anonymous'
  const avatarUrl = comment.profile?.avatar_url
  const timeAgo = getTimeAgo(new Date(comment.created_at))

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3 py-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">{displayName}</span>
            <span className="text-gray-400">{timeAgo}</span>
          </div>
          <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => onReply(comment.id)}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentForm({
  onSubmit,
  placeholder,
  buttonText,
  onCancel,
  autoFocus = false,
}: {
  onSubmit: (content: string) => void
  placeholder: string
  buttonText: string
  onCancel?: () => void
  autoFocus?: boolean
}) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    await onSubmit(content.trim())
    setContent('')
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="px-4 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting...' : buttonText}
        </button>
      </div>
    </form>
  )
}

export default function Comments({ skillId }: CommentsProps) {
  const { comments, loading, addComment, deleteComment, user } = useComments(skillId)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleAddComment = async (content: string) => {
    await addComment(content)
  }

  const handleReply = async (content: string, parentId: string) => {
    await addComment(content, parentId)
    setReplyingTo(null)
  }

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId)
    }
  }

  const totalComments = comments.reduce((acc, c) => {
    return acc + 1 + (c.replies?.length || 0)
  }, 0)

  return (
    <div className="rounded-2xl border border-border bg-white shadow-soft">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments {totalComments > 0 && <span className="text-gray-400">({totalComments})</span>}
        </h3>
      </div>

      <div className="p-6">
        {user ? (
          <div className="mb-6">
            <CommentForm
              onSubmit={handleAddComment}
              placeholder="Share your thoughts on this skill..."
              buttonText="Post Comment"
            />
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              <a href={`/login?next=/skill/${skillId}`} className="text-orange-600 hover:underline font-medium">
                Sign in
              </a>{' '}
              to leave a comment
            </p>
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-gray-400">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  onDelete={handleDelete}
                  onReply={(parentId) => setReplyingTo(parentId)}
                  currentUserId={user?.id}
                />
                {replyingTo === comment.id && (
                  <div className="ml-11 mt-2 mb-4">
                    <CommentForm
                      onSubmit={(content) => handleReply(content, comment.id)}
                      placeholder="Write a reply..."
                      buttonText="Reply"
                      onCancel={() => setReplyingTo(null)}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
