'use client'

import { IPost } from '@/types'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Label } from '../ui/label'
import ReactQuill from 'react-quill-new'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Smile, X } from 'lucide-react'
import emojies from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { UploadDropzone } from '@/lib/uploadthing'
import { useParams, useRouter } from 'next/navigation'
import useTranslate from '@/hooks/use-translate'
import { toast } from 'sonner'
import { editPost } from '@/actions/post.action'
import 'react-quill-new/dist/quill.snow.css'

export default function EditPostForm({ _id, text, image }: IPost) {
  const [postImage, setPostImage] = useState(image)
  const [isLoading, setIsLoading] = useState(false)
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const { lng } = useParams()
  const { t } = useTranslate()

  const formSchema = z.object({
    text: z
      .string()
      .min(2, { message: t('mustBePostBody') })
      .max(1024, { message: t('mustBePostBody') }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const promise = editPost(_id, values.text, postImage)
      .then(({ edietedPost }) => router.push(`/${lng}/post/${edietedPost._id}`))
      .finally(() => setIsLoading(false))
    toast.promise(promise, {
      loading: t('loading'),
      success: t('postEditedSuccessfully'),
      error: t('somethingWentWrong'),
    })
  }

  const handleEmojiSelect = (emoji: string) => {
    const text = form.getValues('text')
    form.setValue('text', `${text}${emoji}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 relative w-full'>
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <Label>{t('postBody')}</Label>
              <FormControl>
                <div className='relative w-full'>
                  <ReactQuill theme='snow' {...field} className='bg-secondary' />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='absolute top-1 right-2'
                      >
                        <Smile />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0 w-full'>
                      <Picker
                        data={emojies}
                        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                        onEmojiSelect={(emoji: { native: string }) =>
                          handleEmojiSelect(emoji.native)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <Label>
            {t('postImage')} <span className='text-muted-foreground'>({t('optional')})</span>
          </Label>
          <div className='bg-secondary relative'>
            {postImage ? (
              <div className='relative'>
                <div className='w-full h-52'>
                  <Image src={postImage} alt='Image' fill />
                </div>
                <Button
                  type='button'
                  size={'icon'}
                  variant={'outline'}
                  className='absolute top-0 right-0 rounded-none bg-secondary'
                  onClick={() => setPostImage('')}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint={'imageUploader'}
                onClientUploadComplete={res => setPostImage(res[0].url)}
                config={{ appendOnPaste: true, mode: 'auto' }}
              />
            )}
          </div>
        </FormItem>
        <Button type='submit' disabled={isLoading}>
          {t('submit')}
        </Button>
      </form>
    </Form>
  )
}
