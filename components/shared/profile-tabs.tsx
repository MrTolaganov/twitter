'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useTranslate from '@/hooks/use-translate'
import { IComment, IPost } from '@/types'
import UserPosts from './user-posts'
import UserComments from './user-comments'
import UserImages from './user-images'
import UserLikes from './user-likes'

interface Props {
  userPosts: IPost[]
  userComments: IComment[]
  userImages: IPost[]
  userLikes: IPost[]
}

export default function ProfileTabs({ userPosts, userComments, userImages, userLikes }: Props) {
  const { t } = useTranslate()

  return (
    <Tabs defaultValue='posts' className='max-md:mb-[48px]'>
      <TabsList className='grid w-full grid-cols-4 border-b border-muted-foreground'>
        <TabsTrigger value='posts'>
          {userPosts.length} {userPosts.length > 1 ? t('posts') : t('post')}
        </TabsTrigger>
        <TabsTrigger value='comments'>
          {userComments.length} {userComments.length > 1 ? t('comments') : t('comment')}
        </TabsTrigger>
        <TabsTrigger value='images'>
          {userImages.length} {userImages.length > 1 ? t('images') : t('image')}
        </TabsTrigger>
        <TabsTrigger value='likes'>
          {userLikes.length} {userLikes.length > 1 ? t('likes') : t('like')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value='posts'>
        <UserPosts userPosts={userPosts} />
      </TabsContent>
      <TabsContent value='comments'>
        <UserComments userComments={userComments} />
      </TabsContent>
      <TabsContent value='images'>
        <UserImages userImages={userImages} />
      </TabsContent>
      <TabsContent value='likes'>
        <UserLikes userLikes={userLikes} />
      </TabsContent>
    </Tabs>
  )
}
