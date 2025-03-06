"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react"

// Statistics data for the ticker
const tickerData = [
  { label: "ANTISEMITIC INCIDENTS", value: "2,717", change: "+34%", isIncrease: true },
  { label: "ONLINE HARASSMENT", value: "63%", change: "+12%", isIncrease: true },
  { label: "PHYSICAL ASSAULTS", value: "88", change: "+167%", isIncrease: true },
  { label: "ANTISEMITIC CONTENT", value: "+500%", isIncrease: true, highlight: true, alert: true },
  { label: "SCHOOL INCIDENTS", value: "219", change: "+141%", isIncrease: true },
  { label: "COLLEGE CAMPUSES", value: "492", change: "+41%", isIncrease: true },
  { label: "VANDALISM CASES", value: "853", change: "+51%", isIncrease: true },
  { label: "THREATS & HARASSMENT", value: "1,776", change: "+29%", isIncrease: true },
  { label: "EXTREMIST PROPAGANDA", value: "852", change: "+38%", isIncrease: true },
]

export default function ScrollingTicker() {
  const [position, setPosition] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % 1000) // Loop back after reaching 1000
    }, 30) // Adjust speed here

    return () => clearInterval(interval)
  }, [isPaused])

  // Create a repeated array of ticker items to ensure continuous scrolling
  const repeatedData = [...tickerData, ...tickerData, ...tickerData]

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 font-sans text-white shadow-md">
      <div className="mx-auto flex max-w-screen-2xl items-center px-4">
        <div className="mr-4 flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Live Data
        </div>

        <div
          className="relative flex-1 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex whitespace-nowrap transition-transform duration-300 ease-linear"
            style={{ transform: `translateX(${-position}px)` }}
          >
            {repeatedData.map((stat, index) => (
              <div key={index} className={`flex items-center px-6 ${stat.highlight ? "text-yellow-200" : ""}`}>
                <span className="mr-2 text-xs font-medium tracking-wider text-blue-100">{stat.label}</span>
                <span
                  className={`mr-1 text-lg font-bold tabular-nums ${stat.highlight ? "text-yellow-200" : "text-white"}`}
                >
                  {stat.value}
                </span>
                {stat.change && (
                  <span className={`flex items-center text-sm ${stat.isIncrease ? "text-red-200" : "text-green-200"}`}>
                    {stat.isIncrease ? (
                      <ArrowUp className="mr-0.5 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-0.5 h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                )}
                {stat.alert && <AlertTriangle className="ml-1 h-3 w-3 text-yellow-200" />}
                <span className="mx-4 text-blue-300">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 