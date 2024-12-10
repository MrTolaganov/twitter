'use client'

import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import useTranslate from '@/hooks/use-translate'

export default function GlobalSearch() {
  const { t } = useTranslate()

  return (
    <div className='flex items-center w-full md:w-1/2 justify-center p-2 mx-auto'>
      <Search className='text-muted-foreground mr-[-32px] z-50' />
      <Input className='h-12 bg-secondary rounded-full pl-[40px]' placeholder={t('search')} />
    </div>
  )
}
