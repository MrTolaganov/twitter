'use client'

import { IUser } from '@/types'
import { useParams, usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import useTranslate from '@/hooks/use-translate'
import { useEffect, useState } from 'react'
import { checkFollowingStatus, followAndUnfollow } from '@/actions/follow.action'
import { sendNotification } from '@/actions/notification.action'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function UserCard({ _id, fullName, username, profileImage }: IUser) {
  const { lng } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { t } = useTranslate()
  const router = useRouter()
  const pathname = usePathname()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const onFollowAndUnFollow = async () => {
    try {
      setIsLoading(true)
      await followAndUnfollow(_id, session?.currentUser._id!, pathname)
      await sendNotification(
        _id,
        `${session?.currentUser.username} get started to ${isFollowing ? 'unfollow' : 'follow'} you`
      )
      setIsFollowing(prev => !prev)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onClickCard = () => {
    router.push(`/${lng}/${username}`)
  }

  const getUserStatus = async () => {
    try {
      const { result } = await checkFollowingStatus(_id)
      setIsFollowing(result)
      setIsFetching(false)
    } catch {
      toast.error(t('somethingWentwrong'))
    }
  }

  useEffect(() => {
    getUserStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className='flex items-center justify-between p-2 hover:bg-secondary rounded-full relative'>
      <div className='flex items-center gap-x-2 cursor-pointer flex-1' onClick={onClickCard}>
        <Avatar>
          <AvatarImage
            src={
              profileImage ||
              'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
            }
            alt={fullName}
          />
          <AvatarFallback className='bg-primary text-secondary font-bold'>
            {fullName.at(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-between pr-2'>
          <div className='font-semibold text-sm'>{fullName}</div>
          <div className='text-muted-foreground text-sm'>{username}</div>
        </div>
      </div>
      {session?.currentUser._id !== _id && (
        <Button
          size={'sm'}
          disabled={isFetching || isLoading}
          variant={isFollowing ? 'outline' : 'default'}
          className='rounded-full text-sm font-semibold absolute right-2'
          onClick={onFollowAndUnFollow}
        >
          {isFetching ? (
            <Loader2 className='animate-spin' />
          ) : isFollowing ? (
            'Unfollow'
          ) : (
            t('follow')
          )}
        </Button>
      )}
    </div>
  )
}
