'use client'

import useTranslate from '@/hooks/use-translate'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { IUser } from '@/types'
import UserCard from './user.card'

export default function WhoFollowCard({ users }: { users: IUser[] }) {
  const { t } = useTranslate()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('whoToFollow')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        {users.map(user => (
          <UserCard key={user._id} {...user} />
        ))}
        {users.length > 3 && (
          <Link
            href={'/users'}
            className='w-full p-2 block hover:bg-secondary rounded-md underline text-blue-400'
          >
            {t('showMore')}
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
