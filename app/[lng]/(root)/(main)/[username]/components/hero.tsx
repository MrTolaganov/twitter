'use client'

import { checkFollowingStatus, followAndUnfollow } from '@/actions/follow.action'
import { sendNotification } from '@/actions/notification.action'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Hero({ _id, backgroundImage, profileImage, fullName }: IUser) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useTranslate()

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
    if (session?.currentUser._id) {
      getUserStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentUser._id, _id])

  return (
    <div className='relative h-48 md:h-64'>
      <div className='relative bg-muted-foreground h-36 md:h-48 w-full'>
        {backgroundImage && (
          <Link href={backgroundImage} target='_blank'>
            <Image src={backgroundImage} alt='Background image' fill className='object-cover' />
          </Link>
        )}
        <div className='absolute -bottom-1/4 md:-bottom-1/3 left-8 md:left-16'>
          <Link
            href={
              profileImage ||
              'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
            }
            target='_blank'
          >
            <Avatar className='size-20 md:size-32 border-4 border-blue-400/80'>
              <AvatarImage
                src={
                  profileImage ||
                  'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                }
                alt={fullName}
                className='object-cover'
              />
            </Avatar>
          </Link>
        </div>
      </div>
      <div className='absolute bottom-0 right-4 md:bottom-3 md:right-16'>
        <Button
          size={'sm'}
          disabled={isFetching || isLoading}
          variant={isFollowing ? 'outline' : 'default'}
          className='rounded-full text-sm font-semibold'
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
      </div>
    </div>
  )
}
