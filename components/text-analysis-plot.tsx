"use client"

import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist'

// Word lists for analysis
const threatWords = new Set(['kill', 'murder', 'death', 'die', 'threat', 'attack', 'terror', 'bomb', 'shoot', 'exterminate', 'destroy'])
const slurWords = new Set(['jew', 'kike', 'hebe', 'yid', 'zionist'])
const profanityWords = new Set(['fuck', 'shit', 'damn', 'hell', 'bitch', 'bastard', 'whore'])

// Function to extract most relevant quoted substring
const extractQuote = (text: string): string => {
  // Find all quoted strings
  const matches = text.match(/"([^"]+)"/g)
  if (!matches) return ''
  
  // Remove the quotes and find the one containing "Jew" (case insensitive)
  const quotes = matches.map(match => match.slice(1, -1))
  const jewQuote = quotes.find(quote => /\bJew\b/i.test(quote))
  
  return jewQuote || quotes[0] || ''
}

// Function to count words in a set
const countWordsInSet = (text: string, wordSet: Set<string>): number => {
  const words = text.toLowerCase().split(/\s+/)
  return words.filter(w => wordSet.has(w)).length
}

// Function to calculate text metrics
const calculateMetrics = (text: string, quote: string) => {
  const threatCount = countWordsInSet(quote, threatWords)
  const slurCount = countWordsInSet(quote, slurWords)
  const profanityCount = countWordsInSet(quote, profanityWords)
  const totalBadWords = threatCount + slurCount + profanityCount
  
  const totalWords = quote.split(/\s+/).length
  const badWordRatio = totalWords > 0 ? totalBadWords / totalWords : 0
  
  const exclamationCount = (quote.match(/!/g) || []).length
  const questionCount = (quote.match(/\?/g) || []).length
  const punctuationCount = exclamationCount + questionCount
  
  const letters = quote.replace(/[^a-zA-Z]/g, '')
  const uppercaseRatio = letters.length > 0 
    ? quote.replace(/[^A-Z]/g, '').length / letters.length 
    : 0
  
  const avgWordLength = totalWords > 0 
    ? quote.replace(/[^a-zA-Z]/g, '').length / totalWords 
    : 0

  // Determine dominant category
  const maxCount = Math.max(threatCount, slurCount, profanityCount)
  let dominantCategory = 'neutral'
  if (maxCount > 0) {
    if (threatCount === maxCount) dominantCategory = 'threat'
    else if (slurCount === maxCount) dominantCategory = 'slur'
    else if (profanityCount === maxCount) dominantCategory = 'profanity'
  }

  return {
    threatCount,
    slurCount,
    profanityCount,
    totalBadWords,
    badWordRatio,
    punctuationCount,
    exclamationCount,
    questionCount,
    uppercaseRatio,
    avgWordLength,
    dominantCategory,
    totalLength: text.length,
    quoteLength: quote.length
  }
}

// Function to remove outliers using IQR method
const removeOutliers = (arr: number[]): number[] => {
  const sorted = [...arr].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  return arr.filter(x => x >= lowerBound && x <= upperBound)
}

// Function to get category color
const getCategoryColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    'threat': '#EF4444', // Red-500
    'slur': '#3B82F6', // Blue-500
    'profanity': '#F97316', // Orange-500
    'neutral': '#94A3B8' // Slate-400
  }
  return colorMap[category] || '#94A3B8'
}

const layout = {
  title: 'Analysis of Antisemitic Quotes',
  autosize: true,
  scene: {
    camera: {
      up: { x: 0, y: 0, z: 1 },
      center: { x: 0, y: 0, z: 0 },
      eye: { x: 1.5, y: 1.5, z: 1.5 }
    },
    xaxis: {
      title: 'Days Since Event',
      type: 'linear'
    },
    yaxis: {
      title: 'Description Length',
      type: 'linear'
    },
    zaxis: {
      title: 'Quote Length',
      type: 'linear',
      range: [0, 1000] // Default range, will be updated in useEffect
    }
  },
  margin: { l: 0, r: 0, t: 30, b: 0 },
  annotations: [
    {
      text: 'Key:<br>' +
            '• X-axis: Days since the incident occurred<br>' +
            '• Y-axis: Total length of the incident description<br>' +
            '• Z-axis: Length of the quoted antisemitic text<br>' +
            '• Point Size: Number of threatening/slur/profane words<br>' +
            '• Colors:<br>' +
            '  - Red: Threat-dominant incidents<br>' +
            '  - Blue: Slur-dominant incidents<br>' +
            '  - Orange: Profanity-dominant incidents<br>' +
            '  - Gray: Neutral or mixed categories',
      x: 0.02,
      y: 0.98,
      xref: 'paper',
      yref: 'paper',
      showarrow: false,
      font: {
        size: 12,
        color: '#666'
      },
      align: 'left'
    }
  ]
}

export default function TextAnalysisPlot() {
  const plotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = plotRef.current
    if (!element) return

    fetch('/jewdata.csv')
      .then(response => response.text())
      .then(csv => {
        const lines = csv.split('\n')
        const headers = lines[0].split(',')
        const data = lines.slice(1)
          .filter(line => {
            const description = line.split(',')[8] || '' // description column
            // Match "Jew" as a standalone word (case insensitive)
            return /\bJew\b/i.test(description)
          })
          .map(line => {
            const values = line.split(',')
            const description = values[8] || '' // description column
            const quote = extractQuote(description)
            
            // Skip rows without quoted text
            if (!quote) return null
            
            const date = new Date(values[1]) // date column
            const daysSince = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
            const metrics = calculateMetrics(description, quote)
            
            return {
              daysSince,
              totalLength: metrics.totalLength,
              quoteLength: metrics.quoteLength,
              dominantCategory: metrics.dominantCategory,
              metrics,
              quote
            }
          })
          .filter((d): d is NonNullable<typeof d> => d !== null)

        // Remove outliers from numeric columns
        const daysSinceValues = removeOutliers(data.map(d => d.daysSince))
        const totalLengthValues = removeOutliers(data.map(d => d.totalLength))
        const quoteLengthValues = removeOutliers(data.map(d => d.quoteLength))

        // Filter data to remove outliers
        const filteredData = data.filter(d => 
          daysSinceValues.includes(d.daysSince) &&
          totalLengthValues.includes(d.totalLength) &&
          quoteLengthValues.includes(d.quoteLength)
        )

        // Update z-axis range based on filtered data
        const maxQuoteLength = Math.max(...filteredData.map(d => d.quoteLength))
        layout.scene.zaxis.range = [0, maxQuoteLength] as [number, number]

        const plotData = {
          x: filteredData.map(d => d.daysSince),
          y: filteredData.map(d => d.totalLength),
          z: filteredData.map(d => d.quoteLength),
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: filteredData.map(d => 8 + d.metrics.totalBadWords * 2),
            color: filteredData.map(d => getCategoryColor(d.dominantCategory)),
            opacity: 0.8
          },
          text: filteredData.map(d => 
            `Category: ${d.dominantCategory}<br>` +
            `Threats: ${d.metrics.threatCount}<br>` +
            `Slurs: ${d.metrics.slurCount}<br>` +
            `Profanity: ${d.metrics.profanityCount}<br>` +
            `Bad Word Ratio: ${d.metrics.badWordRatio.toFixed(2)}<br>` +
            `Exclamation Marks: ${d.metrics.exclamationCount}<br>` +
            `Question Marks: ${d.metrics.questionCount}<br>` +
            `Uppercase Ratio: ${d.metrics.uppercaseRatio.toFixed(2)}<br>` +
            `Avg Word Length: ${d.metrics.avgWordLength.toFixed(1)}<br><br>` +
            `Quote: "${d.quote}"`
          ),
          hoverinfo: 'text'
        }

        Plotly.newPlot(element, [plotData], layout, {
          responsive: true,
          displayModeBar: false
        })
      })
      .catch(error => {
        console.error('Error loading CSV:', error)
      })
  }, [])

  return (
    <div className="w-full h-[600px] rounded-xl bg-white p-4 shadow-lg">
      <div ref={plotRef} className="w-full h-full" />
    </div>
  )
} 