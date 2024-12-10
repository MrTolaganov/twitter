'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { IUser } from '@/types'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Props {
  contacts: IUser[]
}

export default function MessagesList({ contacts }: Props) {
  const { lng } = useParams()
  const { data: session } = useSession()

  return (
    <>
      {contacts.map(contact => (
        <Link
          href={`/${lng}/message/${contact._id}`}
          key={contact._id}
          className='p-2 hover:bg-secondary relative block border-t border-primary'
        >
          <div className='flex items-center gap-x-2 cursor-pointer flex-1'>
            <Avatar>
              <AvatarImage
                src={
                  contact.profileImage ||
                  'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                }
                alt={contact.fullName}
              />
              <AvatarFallback className='bg-primary text-secondary font-bold'>
                {contact.fullName.at(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-between pr-2'>
              <div className='font-semibold text-sm'>{contact.fullName}</div>
              {contact.lastMessage?.image ? (
                <div className='flex items-center gap-x-2'>
                  <Image src={contact.lastMessage.image} alt='Image' width={30} height={20} />
                  <span
                    className={cn('text-sm', contact.lastMessage.isRead && 'text-muted-foreground')}
                  >
                    Photo
                  </span>
                </div>
              ) : (
                <div
                  className={cn(
                    'text-sm line-clamp-1',
                    (contact.lastMessage.isRead ||
                      contact.lastMessage.sender?._id === session?.currentUser._id) &&
                      'text-muted-foreground'
                  )}
                >
                  {contact.lastMessage.message}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
