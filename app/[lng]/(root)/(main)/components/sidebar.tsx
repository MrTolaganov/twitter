'use client'

import { sidebarLinks } from '@/constants'
import Logo from './logo'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useTranslate from '@/hooks/use-translate'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { hasUnreadNotifications } from '@/actions/notification.action'
import { useNotification } from '@/hooks/use-notification'
import { useMessage } from '@/hooks/use-message'
import { hasUnreadMessages } from '@/actions/chat.action'

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t } = useTranslate()
  const { lng } = useParams()
  const { numNotifications, setNumNotifications } = useNotification()
  const { numMessages, setNumMessages } = useMessage()

  useEffect(() => {
    const getHasNotification = async () => {
      const { numUnreadNotifications } = await hasUnreadNotifications(session?.currentUser._id!)
      setNumNotifications(numUnreadNotifications)
    }
    const getHasMessage = async () => {
      const { numMessages } = await hasUnreadMessages(session?.currentUser._id!)
      setNumMessages(numMessages)
    }
    getHasNotification()
    getHasMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentUser._id, pathname])

  return (
    <div className='max-md:hidden h-[95vh] border-r border-muted-foreground flex flex-col justify-between items-center py-2 px-1 md:w-[calc(100vw/3)] fixed bg-background'>
      <div className='flex flex-col gap-y-2'>
        <Logo />
        <div className='flex flex-col gap-y-2 max-md:items-center'>
          {sidebarLinks.map(sidebarLink => (
            <Link
              key={sidebarLink.path}
              href={sidebarLink.path}
              className={cn(
                'flex items-center gap-2 p-4 text-lg font-semibold rounded-full hover:bg-secondary',
                sidebarLink.path === pathname.slice(3) && 'bg-secondary font-bold text-xl'
              )}
            >
              <div className='relative'>
                <sidebarLink.icon />
                {sidebarLink.path === '/notifications' && numNotifications > 0 && (
                  <span className='absolute size-3 bg-blue-400 text-xs top-0 right-0 rounded-full flex justify-center items-center p-2'>
                    {numNotifications}
                  </span>
                )}
                {sidebarLink.path === '/messages' && numMessages > 0 && (
                  <span className='absolute size-3 bg-blue-400 text-xs top-0 right-0 rounded-full flex justify-center items-center p-2'>
                    {numMessages}
                  </span>
                )}
              </div>
              <span className='max-md:hidden'>{t(sidebarLink.name)}</span>
            </Link>
          ))}
        </div>
        <Button
          className='h-12 rounded-full bg-blue-400/80 text-white  hover:bg-blue-400/80'
          asChild
        >
          <Link href={`/${lng}/create-post`} className='py-2 block'>
            <Plus className='md:hidden size-10' />
            <span className='max-md:hidden text-lg font-semibold capitalize'>
              {t('posts').slice(0, 4)}
            </span>
          </Link>
        </Button>
      </div>
      <Link
        href={`/${lng}/profile`}
        className='flex items-center gap-2 font-semibold rounded-full hover:bg-secondary p-2 cursor-pointer md:min-w-1/2'
      >
        <Avatar>
          <AvatarImage
            src={
              session?.currentUser.profileImage ||
              'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
            }
            alt={session?.currentUser.fullName}
          />
          <AvatarFallback className='bg-primary text-secondary'>
            {session?.currentUser.fullName.at(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='max-md:hidden flex flex-col justify-between pr-2'>
          <div className='font-semibold'>{session?.currentUser.fullName}</div>
          <div className='text-muted-foreground'>{session?.currentUser.username}</div>
        </div>
      </Link>
    </div>
  )
}