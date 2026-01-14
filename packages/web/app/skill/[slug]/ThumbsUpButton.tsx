"use client";

import { useState } from "react";

export default function ThumbsUpButton({ 
  skillId, 
  initialCount 
}: { 
  skillId: string; 
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (liked) {
      setCount((c) => c - 1);
      setLiked(false);
    } else {
      setCount((c) => c + 1);
      setLiked(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200
        ${liked 
          ? 'bg-accent/10 border-accent text-accent' 
          : 'bg-white border-border text-gray-600 hover:border-accent hover:text-accent'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
      `}
    >
      <svg 
        className={`w-5 h-5 transition-transform ${isAnimating ? 'scale-125' : ''}`} 
        fill={liked ? "currentColor" : "none"} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={liked ? 0 : 2} 
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
        />
      </svg>
      <span className="font-medium">{count}</span>
    </button>
  );
}
