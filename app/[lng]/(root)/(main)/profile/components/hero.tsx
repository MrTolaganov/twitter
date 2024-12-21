'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import SetUp from './setup'
import { useDialog } from '@/hooks/use-dialog'
import Image from 'next/image'
import Link from 'next/link'
import useTranslate from '@/hooks/use-translate'

export default function Hero() {
  const { data: session } = useSession()
  const { setOpenedProfileDialog } = useDialog()
  const { t } = useTranslate()

  return (
    <>
      <div className='relative h-48 md:h-64'>
        <div className='relative bg-muted-foreground h-36 md:h-48 w-full'>
          {session?.currentUser.backgroundImage && (
            <Link href={session.currentUser.backgroundImage} target='_blank'>
              <div className='relative size-full'>
                <Image
                  src={session.currentUser.backgroundImage}
                  alt='Background image'
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
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
                <AvatarFallback className='relative'>
                  <Image
                    src={
                      session?.currentUser.profileImage ||
                      'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                    }
                    alt={session?.currentUser.fullName!}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </AvatarFallback>
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
            {t('editProfile')}
          </Button>
        </div>
      </div>
      <SetUp />
    </>
  )
}
