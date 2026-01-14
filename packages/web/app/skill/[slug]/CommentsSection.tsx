"use client";

import { useState } from "react";

type Comment = {
  id: string;
  author: string;
  authorGithub?: string;
  content: string;
  createdAt: string;
};

export default function CommentsSection({
  skillId,
  initialComments,
}: {
  skillId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);

    const comment: Comment = {
      id: `temp-${Date.now()}`,
      author: authorName.trim(),
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
    setIsSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-foreground">Comments</h2>

      <div className="mt-4 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-border bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-sm">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-sm">
                      {comment.authorGithub ? (
                        <a
                          href={`https://github.com/${comment.authorGithub}`}
                          target="_blank"
                          className="hover:text-accent"
                        >
                          @{comment.authorGithub}
                        </a>
                      ) : (
                        comment.author
                      )}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || !authorName.trim() || isSubmitting}
          className="px-4 py-2 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </section>
  );
}
