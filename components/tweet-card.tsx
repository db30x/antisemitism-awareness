"use client"

import { useEffect } from "react"
import { Flag } from "lucide-react"

interface TweetCardProps {
  tweet: {
    url: string
  }
  onReport?: (url: string) => void
}

export function TweetCard({ tweet, onReport }: TweetCardProps) {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="relative group">
      {onReport && (
        <button
          onClick={() => onReport(tweet.url)}
          className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Report tweet"
        >
          <Flag className="w-4 h-4 text-red-500" />
        </button>
      )}
      <blockquote 
        className="twitter-tweet" 
        data-conversation="none"
        data-theme="light"
        data-dnt="true"
        data-align="center"
        data-lang="en"
        data-cards="hidden"
      >
        <a href={tweet.url}></a>
      </blockquote>
    </div>
  )
}

