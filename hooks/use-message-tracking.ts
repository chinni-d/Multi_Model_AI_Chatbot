import { useState, useCallback } from 'react'

interface MessageStats {
  requestCount: number
  responseCount: number
  createdAt: Date | null
  updatedAt: Date | null
}

export function useMessageTracking() {
  const [stats, setStats] = useState<MessageStats | null>(null)
  const [loading, setLoading] = useState(false)

  const trackMessage = useCallback(async (type: 'request' | 'response') => {
    try {
      const response = await fetch('/api/messages/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        throw new Error('Failed to track message')
      }

      const data = await response.json()
      
      setStats(prev => ({
        requestCount: data.requestCount,
        responseCount: data.responseCount,
        createdAt: prev?.createdAt || null,
        updatedAt: new Date(),
      }))

      return data
    } catch (error) {
      console.error('Error tracking message:', error)
      throw error
    }
  }, [])

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/messages/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
      return data
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    stats,
    loading,
    trackMessage,
    fetchStats,
  }
}