import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The GameOn Co. - Professional Sports Networking',
  description: 'Connect athletes, coaches, and academies in the sports industry',
  icons: {
    icon: '/logo.png',
  },
}

import ClientWrapper from "@/components/ClientWrapper";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  )
}
