'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IUser } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Header({ profileImage, fullName, username }: IUser) {
  const { lng } = useParams()

  return (
    <Link
      href={`/${lng}/user/${username}`}
      className='p-2 text-sm fixed z-50 bg-background items-center block w-[100vw] md:w-[calc(100vw/3)] border-b border-muted-foreground'
    >
      {/* <Link href={`/${lng}/profile`} className='flex items-center cursor-pointer bg-secondary'> */}
      <div className='flex items-center gap-x-2'>
        <Avatar>
          <AvatarImage src={profileImage} alt={fullName!} width={32} height={32} />
          <AvatarFallback>
            <Image
              src={
                'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
              }
              alt={fullName.at(0)?.toUpperCase()!}
              fill
            />
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-between flex-1'>
          <div className='font-semibold'>{fullName}</div>
          <div className='text-muted-foreground'>{username}</div>
        </div>
      </div>
      {/* </Link> */}
    </Link>
  )
}
