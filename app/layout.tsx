import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AirStay - Travel Packages',
  description: 'Find the best flight, hotel, and car rental packages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
