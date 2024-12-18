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
import NextTopLoader from 'nextjs-toploader'

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.otabektx.uz'),
  title: 'Twitter',
  description: 'This is the twitter clone project that developed by Otabek Tulaganov',
  authors: [{ name: 'Otabek Tulaganov', url: 'https://www.otabektx.uz' }],
  icons: {
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjljjHnedCRCaCfzQwcK6qkflmLoUHgRpZAw&s',
  },
  openGraph: {
    title: 'Twitter',
    description: 'This is the twitter clone project that developed by Otabek Tulaganov',
    images:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6kGU_bHyoW4ITdro3LTbTbmN9RMeZBO70gA&s',
    type: 'website',
    url: 'https://www.otabektx.uz',
    locale: 'en_US',
    emails: 'tulaganovok04@mail.com',
    siteName: 'Twitter',
    countryName: 'Uzbekistan',
  },
}

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }))
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lng } = await params

  return (
    <html lang='en' suppressHydrationWarning dir={dir(lng)}>
      <body
        className={`${montserrat.variable} overflow-x-hidden font-montserrat overflow-y-scroll custom-scrollbar`}
      >
        <QueryProvider>
          <SessionProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color='#3182CE'
                initialPosition={0.5}
                crawlSpeed={200}
                height={2}
                crawl={true}
                showSpinner={false}
                easing='ease'
                speed={200}
                shadow='0 0 10px #3182CE,0 0 5px #3182CE'
              />
              {children}
              <Toaster position='bottom-center' />
            </ThemeProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  )
}