'use client'

import dynamic from 'next/dynamic'

// Dynamically import FloatingChatButton with no SSR to prevent hydration issues
const FloatingChatButton = dynamic(
  () => import('./FloatingChatButton'),
  { ssr: false }
)

export default function ClientOnlyFloatingChat() {
  return <FloatingChatButton />
}
