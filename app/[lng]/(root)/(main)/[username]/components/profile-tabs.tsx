'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useTranslate from '@/hooks/use-translate'

export default function ProfileTabs() {
  const { t } = useTranslate()

  return (
    <Tabs defaultValue='posts'>
      <TabsList className='grid w-full grid-cols-4'>
        <TabsTrigger value='posts'>{t('posts')}</TabsTrigger>
        <TabsTrigger value='replies'>{t('replies')}</TabsTrigger>
        <TabsTrigger value='media'>{t('media')}</TabsTrigger>
        <TabsTrigger value='likes'>{t('likes')}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
