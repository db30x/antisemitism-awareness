"use client"

import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist'

// Function to convert date string to numeric value for plotting
const dateToNumeric = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.getTime()
}

// Function to determine incident severity
const getSeverity = (type: string) => {
  const severityMap: { [key: string]: number } = {
    'Extremist Murder': 5,
    'Terrorist Plot/Attack': 4,
    'Extremist/Police Shootout': 4,
    'Antisemitic Incident:Assault': 3,
    'Antisemitic Incident:Vandalism': 2,
    'Antisemitic Incident:Harassment': 1,
    'White Supremacist Event': 2
  }
  
  const types = type.split(';')
  return Math.max(...types.map(t => severityMap[t] || 0))
}

// Function to get ideology color
const getIdeologyColor = (ideology: string) => {
  const colorMap: { [key: string]: string } = {
    'Right-Wing (White Supremacist)': '#FF0000',
    'Right-Wing (Anti-Government)': '#FF4444',
    'Islamist': '#0000FF',
    '': '#888888'
  }
  return colorMap[ideology] || '#888888'
}

// Sample data - in a real app, this would come from your CSV
const sampleData = {
  x: Array.from({ length: 100 }, () => Math.random() * 10),
  y: Array.from({ length: 100 }, () => Math.random() * 10),
  z: Array.from({ length: 100 }, () => Math.random() * 10),
  mode: 'markers',
  type: 'scatter3d',
  marker: {
    size: 8,
    color: Array.from({ length: 100 }, () => Math.random()),
    colorscale: 'Viridis',
    opacity: 0.8
  }
}

const layout = {
  title: '3D Scatter Plot of Antisemitic Incidents',
  autosize: true,
  scene: {
    camera: {
      up: { x: 0, y: 0, z: 1 },
      center: { x: 0, y: 0, z: 0 },
      eye: { x: 1.5, y: 1.5, z: 1.5 }
    },
    xaxis: {
      title: 'Time',
      type: 'date'
    },
    yaxis: {
      title: 'State'
    },
    zaxis: {
      title: 'Incident Severity',
      range: [0, 5]
    }
  },
  margin: { l: 0, r: 0, t: 30, b: 0 }
}

export default function PlotlyScatter() {
  const plotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (plotRef.current) {
      // Fetch and process the CSV data
      fetch('/jewdata.csv')
        .then(response => response.text())
        .then(csv => {
          const lines = csv.split('\n')
          const headers = lines[0].split(',')
          const data = lines.slice(1).map(line => {
            const values = line.split(',')
            return {
              date: values[1],
              state: values[3],
              type: values[4],
              ideology: values[5]
            }
          })

          const plotData = {
            x: data.map(d => dateToNumeric(d.date)),
            y: data.map(d => d.state),
            z: data.map(d => getSeverity(d.type)),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
              size: 8,
              color: data.map(d => getIdeologyColor(d.ideology)),
              opacity: 0.8
            },
            text: data.map(d => `${d.type}<br>${d.ideology || 'Unknown ideology'}`),
            hoverinfo: 'text'
          }

          Plotly.newPlot(plotRef.current, [plotData], layout, {
            responsive: true,
            displayModeBar: false
          })
        })
        .catch(error => {
          console.error('Error loading CSV:', error)
          // Fallback to sample data if CSV loading fails
          Plotly.newPlot(plotRef.current, [sampleData], layout, {
            responsive: true,
            displayModeBar: false
          })
        })
    }
  }, [])

  return (
    <div className="w-full h-[400px] rounded-xl bg-white p-4 shadow-lg">
      <div ref={plotRef} className="w-full h-full" />
    </div>
  )
} 