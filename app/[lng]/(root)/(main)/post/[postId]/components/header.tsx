'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { t } from 'i18next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaXTwitter } from 'react-icons/fa6'

export default function Header() {
  const { lng } = useParams()
  const { data: session } = useSession()

  return (
    <div className='md:hidden p-2 text-xl font-bold fixed z-50 bg-background w-full flex justify-between items-center border-b border-muted-foreground'>
      <div className='flex items-center gap-x-2'>
        <Link href={`/${lng}/home`}>
          <FaXTwitter className='size-10' />
        </Link>
      </div>
      <span className='capitalize'>{t('post')}</span>
      <Link href={`/${lng}/profile`}>
        <Avatar className='size-10'>
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
  )
}
