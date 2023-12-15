import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientCookiesProvider } from './utils/cookieProvider'
const inter = Inter({ subsets: ['latin'] })
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'OH Delivery',
  description: 'Home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ClientCookiesProvider value={cookies().getAll()}>
          {children}
        </ClientCookiesProvider>
        </body>
    </html>
  )
}
