'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useTranslate from '@/hooks/use-translate'

export default function TabBar() {
  const { t } = useTranslate()

  return (
    <Tabs defaultValue='posts'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='posts'>{t('posts')}</TabsTrigger>
        <TabsTrigger value='users'>{t('users')}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
