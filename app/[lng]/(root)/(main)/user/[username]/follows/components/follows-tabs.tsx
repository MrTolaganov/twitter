'use client'

import UserCard from '@/components/cards/user.card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFollowsTab } from '@/hooks/use-follows-tab'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'

interface Props {
  followings: IUser[]
  followers: IUser[]
}

export default function FollowsTabs({ followings, followers }: Props) {
  const { value } = useFollowsTab()
  const { t } = useTranslate()

  return (
    <Tabs defaultValue={value}>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='followings' className='lowercase'>
          {followings.length} {followings.length > 1 ? t('followings') : t('follower')}
        </TabsTrigger>
        <TabsTrigger value='followers' className='lowercase'>
          {followers.length} {followers.length > 1 ? t('followers') : t('follower')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value='followings' className='p-2'>
        {followings.map(following => (
          <UserCard key={following._id} {...following} />
        ))}
      </TabsContent>
      <TabsContent value='followers' className='p-2'>
        {followers.map(follower => (
          <UserCard key={follower._id} {...follower} />
        ))}
      </TabsContent>
    </Tabs>
  )
}
