'use client'

import { IPost } from '@/types'
import React, { useState } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Heart, MessageCircleMore, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import parse from 'html-react-parser'
import { formatDistanceToNowStrict } from 'date-fns'
import { cn, formatPostTime } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FcLike } from 'react-icons/fc'
import { FaCommentDots } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useAlert } from '@/hooks/use-alert'
import AlertModal from '../shared/alert-modal'
import { likeAndUnlike } from '@/actions/like.action'
import { sendNotification } from '@/actions/notification.action'
import { usePostAction } from '@/hooks/use-post-action'
import useTranslate from '@/hooks/use-translate'

interface Props {
  post: IPost
  detailed?: boolean
}

export default function PostCard({ post, detailed }: Props) {
  const { _id, text, image, author, createdAt } = post
  const { lng } = useParams()
  const { data: session } = useSession()
  const { setOpenedAlert, setPostId } = useAlert()
  const [loader, setLoader] = useState({ likeLoading: false, commentLoading: false })
  const [postData, setPostData] = useState<IPost>(post)
  const { setPostActionState } = usePostAction()
  const router = useRouter()
  const { t } = useTranslate()

  const onLikeAndUnLike = () => {
    if (loader.likeLoading) return
    setLoader(prev => ({ ...prev, likeLoading: true }))
    likeAndUnlike(_id, session?.currentUser._id!)
      .then(() =>
        setPostData(prev => ({
          ...prev,
          liked: !prev.liked,
          numLikes: prev.liked ? prev.numLikes - 1 : prev.numLikes + 1,
        }))
      )
      .then(() => {
        if (author._id !== session?.currentUser._id) {
          sendNotification(
            author._id,
            `${session?.currentUser.username} ${postData.liked ? 'unliked' : 'liked'} your post`,
            `/post/${_id}`
          )
        }
      })
      .finally(() => setLoader(prev => ({ ...prev, likeLoading: false })))
  }

  const onLikesAndComments = (postActionState: 'likes' | 'comments') => {
    setPostActionState(postActionState)
    router.push(`/${lng}/post/${_id}`)
  }

  return (
    <>
      <div className='flex gap-x-2 border-t p-2 border-muted-foreground'>
        <Link href={`/${lng}/user/${author.username}`}>
          <Avatar className={cn('size-10 ', !detailed && 'sticky top-[158px] md:top-[98px]')}>
            <AvatarImage
              src={
                author.profileImage ||
                'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
              }
            />
          </Avatar>
        </Link>
        <div className='flex flex-1 flex-col gap-y-2'>
          <div className='flex justify-between gap-x-3'>
            <div className='flex items-center gap-x-1 flex-wrap'>
              <Link href={`/${lng}/user/${author.username}`} className='line-clamp-1'>
                {author.fullName}
              </Link>
              <Link
                href={`/${lng}/user/${author.username}`}
                className='text-muted-foreground text-sm line-clamp-1'
              >
                {author.username}
              </Link>
              <span className='text-muted-foreground text-sm'>
                &#x2022; {formatPostTime(formatDistanceToNowStrict(createdAt))}
              </span>
            </div>
            {author._id === session?.currentUser._id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreHorizontal className='text-muted-foreground hover:text-blue-400 cursor-pointer' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link href={`/${lng}/edit-post/${_id}`}>
                      <Pencil className='size-5' />
                      <span>{t('editPost')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => {
                      setOpenedAlert(true)
                      setPostId(_id)
                    }}
                  >
                    <Trash2 className='size-5 text-red-500' />
                    <span className='text-red-500'>{t('deletePost')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <Link href={`/${lng}/post/${_id}`} className='prose dark:prose-invert'>
            {parse(text)}
          </Link>
          {image && (
            <Link href={`/${lng}/post/${_id}`}>
              <Image src={image} alt='Post image' width={500} height={500} />
            </Link>
          )}
          <div className={cn(detailed ? 'hidden' : 'flex items-center gap-x-8 text-sm')}>
            <div className='flex items-center gap-x-2 cursor-pointer'>
              {postData.liked ? (
                <FcLike className='size-5' onClick={onLikeAndUnLike} />
              ) : (
                <Heart className={'size-5 text-red-500'} onClick={onLikeAndUnLike} />
              )}
              <span
                className='line-clamp-1 text-muted-foreground cursor-pointer hover:underline hover:text-foreground'
                onClick={() => onLikesAndComments('likes')}
              >
                {postData.numLikes} {postData.numLikes > 1 ? t('likes') : t('like')}
              </span>
            </div>
            <div
              className='flex items-center gap-x-2 cursor-pointer'
              onClick={() => onLikesAndComments('comments')}
            >
              {post.commented ? (
                <FaCommentDots className='size-5 text-blue-500' />
              ) : (
                <MessageCircleMore className='size-5 text-blue-500' />
              )}
              <span className='line-clamp-1 text-muted-foreground cursor-pointer hover:underline hover:text-foreground'>
                {postData.numComments} {postData.numComments > 1 ? t('comments') : t('comment')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <AlertModal />
    </>
  )
}
