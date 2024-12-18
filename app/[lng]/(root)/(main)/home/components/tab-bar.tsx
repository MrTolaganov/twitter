'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useTranslate from '@/hooks/use-translate'
import PopularPosts from './popular-posts'
import LatestPosts from './latest-posts'
import TrendingPosts from './trending-posts'

export default function TabBar() {
  const { t } = useTranslate()

  return (
    <Tabs defaultValue='latest'>
      <TabsList className='grid grid-cols-3 fixed bg-background z-10 w-[100vw] md:w-[calc(100vw/3)] max-md:mt-[56px]'>
        <TabsTrigger value='latest'>{t('latest')}</TabsTrigger>
        <TabsTrigger value='popular'>{t('popular')}</TabsTrigger>
        <TabsTrigger value='trending'>{t('trending')}</TabsTrigger>
      </TabsList>
      <TabsContent value='latest'>
        <LatestPosts />
      </TabsContent>
      <TabsContent value='popular'>
        <PopularPosts />
      </TabsContent>
      <TabsContent value='trending'>
        <TrendingPosts />
      </TabsContent>
    </Tabs>
  )
}
