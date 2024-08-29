'use client';

import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

export function CommitHistory() {
  const [commits, setCommits] = useState<Commit[]>([])

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/repos/bitkojine/ai-minecraft-clone/commits'
        )
        setCommits(response.data.slice(0, 5)) // Limit to 5 most recent commits
      } catch (error) {
        console.error('Error fetching commits:', error)
      }
    }

    fetchCommits()
    const interval = setInterval(fetchCommits, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="commit-history bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3 text-green-400">Recent Commits</h2>
      <ul className="space-y-2">
        {commits.map((commit) => (
          <li key={commit.sha} className="border-b border-gray-700 pb-2">
            <p className="font-medium text-white text-sm">{commit.commit.message}</p>
            <small className="text-gray-400 text-xs">
              {commit.commit.author.name} • {new Date(commit.commit.author.date).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}
