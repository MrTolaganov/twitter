import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { LayoutProps } from '@/types'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { languages } from '@/i18n/settings'
import { dir } from 'i18next'
import './globals.css'
import SessionProvider from '@/components/providers/session.provider'
import QueryProvider from '@/components/providers/query.provider'
import { Toaster } from '@/components/ui/sonner'

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "X. It's what's happening / X",
  description:
    'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.',
  icons: { icon: '/x.svg' },
}

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }))
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lng } = await params

  return (
    <html lang='en' suppressHydrationWarning dir={dir(lng)}>
      <body className={`${montserrat.variable} overflow-x-hidden font-montserrat`}>
        <QueryProvider>
          <SessionProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position='bottom-center' />
            </ThemeProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
