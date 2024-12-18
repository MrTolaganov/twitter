'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePostAction } from '@/hooks/use-post-action'
import useTranslate from '@/hooks/use-translate'
import Likes from './likes'
import Comments from './comments'
import { IComment, IPost, IUser } from '@/types'

interface Props {
  post: IPost
  likedUsers: IUser[]
  commentedUsers: IComment[]
}

export default function PostTabs({ post, likedUsers, commentedUsers }: Props) {
  const { t } = useTranslate()
  const { postActionState } = usePostAction()

  return (
    <Tabs defaultValue={postActionState} className='border-t border-muted-foreground'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='likes'>
          {likedUsers.length} {likedUsers.length > 1 ? t('likes') : t('like')}
        </TabsTrigger>
        <TabsTrigger value='comments'>
          {commentedUsers.length} {commentedUsers.length > 1 ? t('comments') : t('comment')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value='likes'>
        <Likes postId={post._id} />
      </TabsContent>
      <TabsContent value='comments'>
        <Comments post={post} />
      </TabsContent>
    </Tabs>
  )
}
