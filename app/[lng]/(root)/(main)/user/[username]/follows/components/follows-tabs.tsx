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
  const { value, setValue } = useFollowsTab()
  const { t } = useTranslate()

  return (
    <Tabs defaultValue={value}>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger
          value='followings'
          className='lowercase'
          onClick={() => setValue('followings')}
        >
          {followings.length} {followings.length > 1 ? t('followings') : t('following')}
        </TabsTrigger>
        <TabsTrigger value='followers' className='lowercase' onClick={() => setValue('followers')}>
          {followers.length} {followers.length > 1 ? t('followers') : t('follower')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value='followings' className='p-2'>
        {followings.length > 0 ? (
          followings.map(following => <UserCard key={following._id} {...following} />)
        ) : (
          <div className='text-center py-4'>{t('noFollowingsFound')}</div>
        )}
      </TabsContent>
      <TabsContent value='followers' className='p-2'>
        {followers.length > 0 ? (
          followers.map(follower => <UserCard key={follower._id} {...follower} />)
        ) : (
          <div className='text-center py-4'>{t('noFollowersFound')}</div>
        )}
      </TabsContent>
    </Tabs>
  )
}
