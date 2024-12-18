'use client'

import useTranslate from '@/hooks/use-translate'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { IUser } from '@/types'
import UserCard from './user.card'
import { useParams } from 'next/navigation'

export default function WhoFollowCard({ users }: { users: IUser[] }) {
  const { t } = useTranslate()
  const { lng } = useParams()

  return (
    <Card className='bg-secondary/75 space-y-4'>
      <CardHeader className='px-4 py-0 pt-4'>
        <CardTitle className='text-lg'>{t('whoToFollow')}</CardTitle>
      </CardHeader>
      <CardContent className='px-4 py-0 pb-4'>
        {users.map(user => (
          <UserCard key={user._id} {...user} />
        ))}
        {users.length > 5 && (
          <Link
            href={`/${lng}/explore`}
            className='w-full p-2 block hover:bg-blue-400/10 rounded-md underline text-blue-400 text-center'
          >
            {t('showMore')}
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
