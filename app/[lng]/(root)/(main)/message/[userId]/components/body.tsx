'use client'

import { deleteMessage, editMessage, sendChatMessage } from '@/actions/chat.action'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useTranslate from '@/hooks/use-translate'
import { UploadDropzone } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { IChat } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Check, CheckCheck, Paperclip, Pencil, SendHorizontal, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
  chats: IChat[]
}

export default function Body({ chats }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const [allChats, setAllChats] = useState<IChat[]>(chats)
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { userId } = useParams()
  const [edit, setEdit] = useState({ isEditing: false, messageId: '' })

  const formSchema = z.object({ message: z.string().min(1), image: z.string().optional() })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '', image: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      if (edit.isEditing) {
        const { editedChat } = await editMessage(edit.messageId, values.message)
        // @ts-ignore
        setAllChats(prev =>
          prev.map(chat =>
            chat._id === edit.messageId ? { ...editedChat, receiver: { _id: userId } } : chat
          )
        )
      } else {
        const { chat } = await sendChatMessage(
          values.message,
          values.image!,
          session?.currentUser._id!,
          userId as string
        )
        setAllChats(prev => [...prev, chat])
      }
      setEdit({ isEditing: false, messageId: '' })
      form.reset()
    } catch {
      toast.error(t('somethingWentWrong'))
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
      setAllChats(prev => prev.filter(chat => chat._id !== messageId))
    } catch {
      toast.error(t('somethingWentWrong'))
    }
  }

  const onEdit = (messageId: string, message: string) => {
    setEdit({ isEditing: true, messageId })
    form.setValue('message', message)
  }

  useEffect(() => divRef.current?.scrollIntoView({ behavior: 'smooth' }), [pathname])

  return (
    <>
      <div
        className='min-h-[calc(100vh-205px)] md:h-[calc(100vh-156px)] flex justify-end flex-col mb-[56px] space-y-1 relative'
        ref={divRef}
      >
        {allChats.length === 0 ? (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <span
              className='text-9xl cursor-pointer'
              onClick={() => onSubmit({ message: '🖐️', image: '' })}
            >
              🖐️
            </span>
          </div>
        ) : (
          allChats.map(chat => (
            <div
              key={chat._id}
              className={cn(
                'relative max-w-80  rounded-t-xl min-w-20',
                chat.receiver._id === userId
                  ? 'self-end bg-blue-500/80 text-foreground rounded-bl-xl'
                  : 'self-start bg-secondary rounded-br-xl',
                chat.message === '🖐️' && 'text-center',
                !chat.image && 'px-2 pb-3 pt-1'
              )}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  {chat.image ? (
                    <Image src={chat.image} alt='Image' width={300} height={200} />
                  ) : (
                    chat.message
                  )}
                  <div className='flex items-center absolute bottom-0 right-0 text-foreground'>
                    <span className='text-[8px] mr-1'>
                      {format(chat.createdAt, 'MMM dd HH:mm')}
                    </span>
                    {chat.receiver._id === userId &&
                      (chat.isRead ? <CheckCheck size={12} /> : <Check size={12} />)}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className={cn(chat.receiver._id !== userId && 'hidden')}>
                  <ContextMenuItem
                    className={cn(chat.image ? 'hidden' : 'flex items-center gap-x-2')}
                    onClick={() => onEdit(chat._id, chat.message)}
                  >
                    <Pencil size={14} />
                    <span>{t('edit')}</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    className='flex items-center gap-x-2'
                    onClick={() => onDelete(chat._id)}
                  >
                    <Trash2 size={14} />
                    <span>{t('delete')}</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          ))
        )}
      </div>
      <div className='p-2 text-sm fixed z-50 bg-background items-center block w-[100vw] md:w-[calc(100vw/3)] border-t border-muted-foreground bottom-[48.8px] md:bottom-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center gap-x-2 w-full'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      placeholder={`${t('typeMessage')}...`}
                      {...field}
                      disabled={isLoading}
                      className='bg-secondary rounded-full h-10'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  type='button'
                  variant={'outline'}
                  size={'icon'}
                  disabled={isLoading}
                  className='rounded-full border border-foreground'
                >
                  <Paperclip className='cursor-pointer' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle />
                </DialogHeader>
                <UploadDropzone
                  endpoint={'imageUploader'}
                  onClientUploadComplete={res => {
                    onSubmit({ message: '', image: res[0].url })
                    setIsOpen(false)
                  }}
                  config={{ appendOnPaste: true, mode: 'auto' }}
                />
              </DialogContent>
            </Dialog>
            <Button type='submit' size={'icon'} disabled={isLoading} className='rounded-full'>
              <SendHorizontal className='cursor-pointer' />
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
