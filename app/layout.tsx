import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AntisemitismExists',
  description: 'Raising awareness about antisemitism in our digital world',
  icons: {
    icon: [
      { url: '/sixteen.png', sizes: '16x16', type: 'image/png' },
      { url: '/thirtytwo.png', sizes: '32x32', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
