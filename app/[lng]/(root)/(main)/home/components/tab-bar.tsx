'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TabBar() {
  return (
    <Tabs defaultValue='all' className='fixed w-[calc(100vw-64px)] md:w-[550px] max-md:mt-16'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='all'>All</TabsTrigger>
        <TabsTrigger value='following'>Following</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
