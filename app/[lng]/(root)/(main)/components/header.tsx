'use client'

import useTranslate from '@/hooks/use-translate'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const { t } = useTranslate()

  return (
    <div className='md:hidden capitalize p-4 text-xl font-bold fixed z-50 bg-background w-full' >
      {t(pathname.slice(4))}
    </div>
  )
}
