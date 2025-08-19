import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock data - in a real app, this would come from a database
const generateMockAnalytics = () => {
  const now = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 100) + 20,
      unique: Math.floor(Math.random() * 80) + 15
    }
  }).reverse()

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      visitors: Math.floor(Math.random() * 2000) + 500,
      pageViews: Math.floor(Math.random() * 5000) + 1000
    }
  }).reverse()

  const contacts = Array.from({ length: 15 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 2)
    const statuses = ['pending', 'replied']
    return {
      date: date.toLocaleDateString(),
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
      subject: `Inquiry about ${['collaboration', 'job opportunity', 'project', 'research'][i % 4]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }
  })

  return {
    visitors: {
      daily: last30Days,
      monthly: monthlyData,
      total: 12543,
      uniqueTotal: 8932
    },
    contacts: {
      messages: contacts,
      totalMessages: 47,
      responseRate: 85
    },
    performance: {
      pageLoadTime: 1.2,
      bounceRate: 32,
      avgSessionDuration: 185, // seconds
      topPages: [
        { page: '/', views: 5432, avgTime: 120 },
        { page: '/projects', views: 2341, avgTime: 180 },
        { page: '/experience', views: 1876, avgTime: 95 },
        { page: '/contact', views: 987, avgTime: 45 }
      ]
    },
    geography: {
      countries: [
        { country: 'United States', visitors: 4521 },
        { country: 'India', visitors: 2345 },
        { country: 'Canada', visitors: 1876 },
        { country: 'United Kingdom', visitors: 1234 },
        { country: 'Germany', visitors: 987 }
      ],
      cities: [
        { city: 'New York', visitors: 1876 },
        { city: 'San Francisco', visitors: 1543 },
        { city: 'Mumbai', visitors: 1234 },
        { city: 'Toronto', visitors: 987 },
        { city: 'London', visitors: 876 }
      ]
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session')
    if (!adminSession || adminSession.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In a real application, you would:
    // 1. Connect to your analytics database (PostgreSQL, MongoDB, etc.)
    // 2. Query visitor data from tracking tables
    // 3. Query contact form submissions
    // 4. Calculate performance metrics
    // 5. Get geographic data from IP tracking

    // For now, return mock data
    const analytics = generateMockAnalytics()

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// You can also add a POST endpoint to track new visitors/events
export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json()

    // Log the event for analytics
    console.log('Analytics event:', {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      referer: request.headers.get('referer')
    })

    // In a real app, you would save this to your database
    // await saveAnalyticsEvent({ event, data, timestamp: new Date(), ... })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
