'use client'

import { clearChatContacts, deleteChatContact, getChatContacts } from '@/actions/chat.action'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMessage } from '@/hooks/use-message'
import useTranslate from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { IUser } from '@/types'
import { Loader2, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function MessagesList() {
  const { lng } = useParams()
  const { data: session } = useSession()
  const [allContacts, setAllContacts] = useState<IUser[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslate()
  const { setNumMessages } = useMessage()

  const onDelete = (userId: string) => {
    setIsLoading(true)
    deleteChatContact(session?.currentUser._id!, userId)
      .then(({ numMessages }) => {
        setAllContacts(prev => prev.filter(contact => contact._id !== userId))
        setNumMessages(numMessages)
      })
      .catch(() => toast.error(t('somethingWentWrong')))
      .finally(() => setIsLoading(false))
  }

  const onClear = () => {
    setIsLoading(true)
    clearChatContacts(session?.currentUser._id!)
      .then(() => {
        setAllContacts([])
        setNumMessages(0)
      })
      .catch(() => toast.error('somethingWentWrong'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const getAllContacts = async () => {
      try {
        setIsFetching(true)
        const { contacts } = await getChatContacts(session?.currentUser._id!)
        setAllContacts(contacts)
        setIsFetching(false)
      } catch {
        toast.error(t('somethingWentWrong'))
      }
    }
    if (session?.currentUser._id) {
      getAllContacts()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentUser._id])

  return (
    <>
      {isFetching ? (
        <div className='w-full py-4'>
          <Loader2 className='animate-spin mx-auto' />
        </div>
      ) : (
        <div className='flex flex-col items-center gap-y-4'>
          <div className='w-full'>
            {allContacts.map(({ _id, profileImage, fullName, lastMessage }) => (
              <div
                key={_id}
                className='p-2 hover:bg-secondary block border-t border-muted-foreground'
              >
                <div className='flex items-center gap-x-2'>
                  <Link
                    href={`/${lng}/message/${_id}`}
                    className='flex items-center gap-x-2 flex-1'
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          profileImage ||
                          'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                        }
                        alt={fullName!}
                      />
                    </Avatar>
                    <div className='flex flex-col justify-between pr-2'>
                      <div className='font-semibold text-sm'>{fullName}</div>
                      {lastMessage?.image ? (
                        <div className='flex items-center gap-x-2'>
                          <Image src={lastMessage.image} alt='Image' width={30} height={20} />
                          <span
                            className={cn('text-sm', lastMessage.isRead && 'text-muted-foreground')}
                          >
                            {t('photo')}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'text-sm line-clamp-1',
                            (lastMessage.isRead ||
                              lastMessage.sender?._id === session?.currentUser._id) &&
                              'text-muted-foreground'
                          )}
                        >
                          {lastMessage.message}
                        </div>
                      )}
                    </div>
                  </Link>
                  <Button
                    size={'icon'}
                    variant={'destructive'}
                    disabled={isLoading}
                    onClick={() => onDelete(_id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {allContacts.length > 0 ? (
            <Button
              variant={'destructive'}
              className='mx-auto'
              disabled={isLoading}
              onClick={onClear}
            >
              {t('clearAll')}
            </Button>
          ) : (
            <span>{t('anyMessages')}</span>
          )}
        </div>
      )}
    </>
  )
}
