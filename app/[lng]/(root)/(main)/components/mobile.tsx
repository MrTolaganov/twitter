'use client'

import { hasUnreadMessages } from '@/actions/chat.action'
import { hasUnreadNotifications } from '@/actions/notification.action'
import { sidebarLinks } from '@/constants'
import { useMessage } from '@/hooks/use-message'
import { useNotification } from '@/hooks/use-notification'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Mobile() {
  const pathname = usePathname()
  const { data: session } = useSession()
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
    <div className='md:hidden fixed bottom-0 grid grid-cols-5 z-40 w-full border-t border-muted-foreground p-1 bg-background'>
      {sidebarLinks.map(({ path, icon: Icon }) => (
        <Link
          key={path}
          href={path}
          className={cn(
            'relative mx-auto hover:bg-primary hover:text-secondary p-2 rounded-full',
            path === pathname.slice(3) && 'bg-primary text-secondary font-bold text-xl'
          )}
        >
          <Icon />
          {path === '/notifications' && numNotifications > 0 && (
            <span className='absolute size-3 bg-blue-400 text-xs top-0 right-0 rounded-full flex justify-center items-center p-2'>
              {numNotifications}
            </span>
          )}
          {path === '/messages' && numMessages > 0 && (
            <span className='absolute size-3 bg-blue-400 text-xs top-0 right-0 rounded-full flex items-center justify-center p-2'>
              {numMessages}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
