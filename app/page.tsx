"use client"

import { ArrowRight, Clock, Shuffle, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import CountdownTimer from "@/components/countdown-timer"
import StatisticsCard from "@/components/statistics-card"
import { TweetCard } from "@/components/tweet-card"
import { TweetEmbed } from "@/lib/tweets"
import { Statistics } from "@/lib/types"
import { toast } from "sonner"
import MovingTextBar from "@/components/moving-text-bar"
import ScrollingTicker from "@/components/scrolling-ticker"
import { allTweets } from "@/lib/all-tweets"
import TextAnalysisPlot from "@/components/text-analysis-plot"
import dynamic from "next/dynamic"
import { NLPSection } from "@/components/nlp-section"

// Function to get random tweets
function getRandomTweets(count: number = 4): string[] {
  const shuffled = [...allTweets].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Add the getCategoryColor function
function getCategoryColor(category: string): string {
  switch (category) {
    case "threats":
      return "#EF4444";
    case "slurs":
      return "#3B82F6";
    case "profanity":
      return "#F97316";
    default:
      return "#94A3B8";
  }
}

// Add sample data for the plot
const sampleData = [
  { sentiment: -0.5, engagement: 50, impact: 30, category: "threats", text: "Sample threat" },
  { sentiment: 0.2, engagement: 70, impact: 40, category: "slurs", text: "Sample slur" },
  { sentiment: -0.8, engagement: 60, impact: 50, category: "profanity", text: "Sample profanity" },
  { sentiment: 0.1, engagement: 40, impact: 20, category: "neutral", text: "Sample neutral" },
];

export default function Home() {
  const [tweets, setTweets] = useState<string[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isShuffling, setIsShuffling] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/statistics')
        if (!statsRes.ok) throw new Error('Failed to fetch statistics')
        const statsData = await statsRes.json()
        setStatistics(statsData)
        
        // Set initial random tweets (exactly 4)
        setTweets(getRandomTweets(4))
      } catch (error) {
        toast.error('Failed to load data')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleShuffle = async () => {
    setIsShuffling(true)
    // First, clear the tweets
    setTweets([])
    
    // Wait a short moment before showing new tweets
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Then set new random tweets
    setTweets(getRandomTweets(4))
    setIsShuffling(false)
  }

  const handleReportTweet = async (tweetUrl: string) => {
    try {
      // Here you would typically send the report to your backend
      toast.success('Tweet reported successfully')
    } catch (error) {
      toast.error('Failed to report tweet')
      console.error(error)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const name = formData.get('name') as string

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      toast.success('Successfully subscribed to newsletter!')
      e.currentTarget.reset()
    } catch (error) {
      toast.error('Failed to subscribe to newsletter')
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      {/* Statistics Ticker */}
      <ScrollingTicker />

      {/* Header Section - adjust top padding to account for ticker */}
      <section className="container mx-auto px-4 pt-16 md:pt-24 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <h1 className="font-sans text-6xl font-extrabold tracking-tight md:text-8xl relative">
          <span className="relative inline-block">
            Antisemitism
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </span>
          <span className="text-blue-600 relative inline-block">
            exists.
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600"></div>
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-xl text-slate-600 md:text-2xl leading-relaxed">
          Antisemitism is real—not a distant issue. We gather daily examples of hateful language from social platforms to expose its persistence and use data-driven insights to drive solutions for change.
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <p className="text-sm font-medium">
              Warning: The following tweets contain explicit language and hate speech. Viewer discretion is advised.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto mt-16 grid gap-8 px-4 md:grid-cols-5 lg:gap-12">
        {/* Documented Hate Speech Section */}
        <div className="md:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Daily Hate Exposed</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Next update:</span>
                <CountdownTimer />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 [&_.twitter-tweet]:!text-[24px] [&_.twitter-tweet]:!leading-relaxed [&_.twitter-tweet]:!font-sans [&_.twitter-tweet]:!text-slate-900">
              {isLoading || isShuffling ? (
                <div className="flex flex-col items-center justify-center py-12 col-span-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="mt-4 text-slate-600">Loading tweets...</p>
                </div>
              ) : tweets.length > 0 ? (
                tweets.map((url) => (
                  <TweetCard 
                    key={url} 
                    tweet={{ url }} 
                    onReport={handleReportTweet}
                  />
                ))
              ) : (
                <div className="text-center py-8 col-span-full">No tweets found</div>
              )}
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={handleShuffle}
                disabled={isShuffling}
                className="flex items-center gap-2 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isShuffling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Shuffling...
                  </>
                ) : (
                  <>
                    <Shuffle className="h-4 w-4" />
                    Shuffle Tweets
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How You Can Help Section */}
        <div className="md:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">How You Can Help</h2>
            </div>

            <div className="space-y-4">
              {/* Main Call to Action */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Submit Content</h3>
                <p className="text-blue-800 text-lg leading-relaxed mb-6">
                  If you see antisemitic posts or comments, please share them with us. Your submissions help document antisemitism and drive meaningful change through data and awareness.
                </p>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdgf5KFGak5SMKmVdD_iK8O5DXZ-rDdPV-2sFwv_3bdgQtEkQ/viewform?usp=dialog" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium text-sm group"
                >
                  Submit Content for Documentation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <span className="text-sm font-medium">Real-time Updates</span>
                  </div>
                  <p className="text-slate-600 text-sm">Your submissions are processed and added to our database immediately</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-150"></div>
                    <span className="text-sm font-medium">Data Analysis</span>
                  </div>
                  <p className="text-slate-600 text-sm">We analyze submissions using natural language processing to identify hate speech patterns</p>
                </div>
              </div>

              {/* Additional Ways to Help */}
              <div className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Other Ways to Help
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-sm">1</span>
                    </div>
                    <p className="text-slate-300 text-sm">Share our findings with your network to raise awareness</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-sm">2</span>
                    </div>
                    <p className="text-slate-300 text-sm">Report antisemitic content on social media platforms</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-sm">3</span>
                    </div>
                    <p className="text-slate-300 text-sm">Check our website regularly for updated research findings and analysis</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto mt-12 px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Antisemitic Hate Crime Statistics</h2>
              <p className="text-slate-600 mt-1">Tracking incidents and trends across platforms</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="text-center py-8 col-span-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading latest statistics...</p>
              </div>
            ) : statistics ? (
              <>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Reported Incidents</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{statistics.totalIncidents}</span>
                    <span className="text-red-600">+{statistics.yearOverYearChange.totalIncidents}%</span>
                  </div>
                  <p className="mt-2 text-slate-600 text-sm">Total antisemitic incidents reported in 2021</p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Online Harassment</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{statistics.onlineHarassment}%</span>
                    <span className="text-blue-600">+{statistics.yearOverYearChange.onlineHarassment}%</span>
                  </div>
                  <p className="mt-2 text-slate-600 text-sm">Percentage of incidents occurring online</p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Physical Assaults</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{statistics.physicalAssaults}</span>
                    <span className="text-purple-600">+{statistics.yearOverYearChange.physicalAssaults}%</span>
                  </div>
                  <p className="mt-2 text-slate-600 text-sm">Violent antisemitic attacks in 2021</p>
                </div>

                <div className="col-span-full mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">Critical Insight</h3>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    Antisemitic content online has increased by <span className="font-semibold">500%</span> on certain platforms since October 2023, highlighting the urgent need for continued monitoring and response.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 col-span-full">
                <p className="text-slate-600">Unable to load statistics. Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Section Divider */}
      <div className="w-full bg-gradient-to-r from-blue-900 via-blue-950 to-blue-950 py-20 mt-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white tracking-tight mb-6 animate-fade-in">
              How to Help Fix This?
              <span className="text-blue-100 block mt-2">Data.</span>
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
              Through systematic data collection and analysis, we transform individual incidents into actionable insights, enabling targeted responses to combat antisemitism effectively.
            </p>
            <div className="mt-8 flex justify-center gap-8">
              <div className="flex items-center gap-2 text-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></div>
                <span>Document</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse delay-150"></div>
                <span>Analyze</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse delay-300"></div>
                <span>Act</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"></div>
      </div>

      {/* NLP Section */}
      <NLPSection />

      {/* Text Analysis Section */}
      <section className="container mx-auto mt-12 px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Header with Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Analysis of Antisemitic Language Patterns</h2>
              <p className="mt-2 text-slate-600">
                Analyzing patterns in antisemitic incidents where "Jew" appears as a standalone term
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium">Interactive Analysis</span>
              </div>
            </div>
          </div>

          {/* Analysis Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl bg-slate-50 p-4 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Analysis Focus</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Examining incidents where "Jew" appears as a standalone term to identify patterns in antisemitic rhetoric
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Data Points</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Each point represents a specific incident, with position and characteristics revealing language patterns
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Time Evolution</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Tracking how antisemitic language and rhetoric have evolved over time in digital spaces
              </p>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
            <div className="absolute -top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="text-blue-500">+</span>
              Interactive 3D Visualization
              <span className="text-blue-500">+</span>
            </div>
            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden bg-white">
              <TextAnalysisPlot />
            </div>
            <div className="mt-4 text-center text-sm text-slate-500">
              Data source: Anti-Defamation League (ADL)
            </div>
          </div>

          {/* Insights and Methodology */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Key Insights</h3>
              </div>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Language Categories</span>
                    <p className="text-sm mt-1">Incidents are categorized into threats, slurs, and profanity to identify patterns in antisemitic rhetoric.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Text Analysis</span>
                    <p className="text-sm mt-1">Analysis of quoted text reveals patterns in language use, intensity, and style across different incidents.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Temporal Patterns</span>
                    <p className="text-sm mt-1">Tracking how incidents and their characteristics change over time to understand evolving patterns.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Methodology</h3>
              </div>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Text Extraction</span>
                    <p className="text-sm mt-1">Identifying and extracting quoted text containing the word "Jew" as a standalone term.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Pattern Recognition</span>
                    <p className="text-sm mt-1">Analyzing text for patterns in language use, including threats, slurs, and profanity.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Data Visualization</span>
                    <p className="text-sm mt-1">Creating interactive 3D visualizations to explore relationships between different aspects of the incidents.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="container mx-auto mt-20 px-4 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-lg md:p-12 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-blue-300 mb-6 backdrop-blur-sm border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-sm font-medium">Research in Progress</span>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl text-white mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Statistical Research
                </span>
                <br />
                <span className="text-2xl md:text-3xl text-blue-300">Coming June 2025</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                Leveraging advanced AI and data analytics to uncover deeper insights into antisemitic patterns and trends. Publishing June 2025.
              </p>

              {/* Contact Section */}
              <div className="mt-12">
                <div className="flex gap-6 justify-center">
                  <a
                    href="https://linkedin.com/in/david-balin-71b00a307"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.601-1-1.601-1 0-1.16.781-1.16 1.601v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Statistics Ticker */}
      <div className="mt-20">
        <ScrollingTicker />
      </div>
    </main>
  )
}

