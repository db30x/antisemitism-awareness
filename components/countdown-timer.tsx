"use client"

import { useEffect, useState } from "react"

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Calculate the time until midnight
    const calculateTimeUntilMidnight = () => {
      const now = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(now.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const difference = tomorrow.getTime() - now.getTime()

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { hours, minutes, seconds }
    }

    // Set initial time
    setTimeLeft(calculateTimeUntilMidnight())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeUntilMidnight())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <span className="font-mono font-medium">
      {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
      {String(timeLeft.seconds).padStart(2, "0")}
    </span>
  )
}

