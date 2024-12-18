'use client'

import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import useTranslate from '@/hooks/use-translate'

export default function GlobalSearch() {
  const { t } = useTranslate()

  return (
    <div className='flex items-center ml-[40px] space-y-2'>
      <Search className='text-muted-foreground mr-[-40px] pr-2 z-50' />
      <Input
        className='h-12 bg-secondary rounded-full pl-[40px]'
        placeholder={`${t('search')}...`}
      />
    </div>
  )
}
