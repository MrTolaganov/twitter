'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import SetUp from './setup'
import { useDialog } from '@/hooks/use-dialog'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  const { data: session } = useSession()
  const { setOpenedProfileDialog } = useDialog()

  return (
    <>
      <div className='relative h-48 md:h-64'>
        <div className='relative bg-muted-foreground h-36 md:h-48 w-full'>
          {session?.currentUser.backgroundImage && (
            <Link href={session.currentUser.backgroundImage} target='_blank'>
              <Image
                src={session.currentUser.backgroundImage}
                alt='Background image'
                fill
                className='object-cover'
              />
            </Link>
          )}
          <div className='absolute -bottom-1/4 md:-bottom-1/3 left-8 md:left-16'>
            <Link
              href={
                session?.currentUser.profileImage ||
                'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
              }
              target='_blank'
            >
              <Avatar className='size-20 md:size-32 border-4 border-blue-400/80'>
                <AvatarImage
                  src={
                    session?.currentUser.profileImage ||
                    'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                  }
                  alt={session?.currentUser.fullName}
                  className='object-cover'
                />
              </Avatar>
            </Link>
          </div>
        </div>
        <div className='absolute bottom-0 right-4 md:bottom-3 md:right-16'>
          <Button
            variant={'outline'}
            className='rounded-full border-2 border-secondary'
            onClick={() => setOpenedProfileDialog(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>
      <SetUp />
    </>
  )
}
