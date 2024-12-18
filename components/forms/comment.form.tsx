'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '../ui/textarea'
import { useState } from 'react'
import { addComment, editComment } from '@/actions/comment.action'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import useTranslate from '@/hooks/use-translate'
import { IComment, IPost } from '@/types'
import { useCommentForm } from '@/hooks/use-comment-form'
import { sendNotification } from '@/actions/notification.action'

interface Props {
  post: IPost
  commentData: IComment | null
  commentsData: IComment[]
  setCommentData: (commentData: IComment | null) => void
  setCommentsData: (commentsData: IComment[]) => void
}

export default function CommentForm(props: Props) {
  const { post, commentData, setCommentData, commentsData, setCommentsData } = props
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { t } = useTranslate()
  const { setOpenEditCommentForm } = useCommentForm()

  const formSchema = z.object({
    text: z
      .string()
      .min(3, { message: t('mustBeComment') })
      .max(256),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: commentData ? commentData.text : '' },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    if (commentData) {
      editComment(commentData._id, values.text)
        .then(({ comment }) => {
          setCommentsData(commentsData.map(c => (c._id === commentData._id ? comment : c)))
          setOpenEditCommentForm(false)
          setCommentData(null)
        })
        .catch(() => toast.error(t('somethingWentWrong')))
        .finally(() => setIsLoading(false))
    } else {
      addComment(values.text, post._id, session?.currentUser._id!)
        .then(({ comment }) => {
          setCommentsData([...commentsData, comment])
          if (post.author._id !== session?.currentUser._id) {
            sendNotification(
              post.author._id,
              `${session?.currentUser.username} commented your post`,
              `/post/${post._id}`
            )
          }
        })
        .catch(() => toast.error(t('somethingWentWrong')))
        .finally(() => {
          setIsLoading(false)
          form.reset()
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isLoading}
                  placeholder={`${t('commentItOut')}...`}
                  className='bg-secondary text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading} size={'sm'}>
            {t('submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
