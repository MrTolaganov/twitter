'use client'

import { getLatestPosts } from '@/actions/post.action'
import LoadingPostCard from '@/components/cards/loading-post.card'
import PostCard from '@/components/cards/post.card'
import useTranslate from '@/hooks/use-translate'
import { IPost } from '@/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function LatestPosts() {
  const [latestPosts, setLatestPosts] = useState<IPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslate()
  const { data: session } = useSession()

  const onGetLatestPosts = () => {
    getLatestPosts(session?.currentUser._id!)
      .then(({ latestPosts }) => setLatestPosts(latestPosts))
      .catch(() => toast.error(t('somethingWentWrong')))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    onGetLatestPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='pt-[112px] md:pt-[56px] pb-[49px] md:pb-0'>
      {isLoading ? (
        Array.from({ length: 8 }).map((_, idx) => <LoadingPostCard key={idx} />)
      ) : latestPosts.length > 0 ? (
        latestPosts.map(post => <PostCard key={post._id} post={post} />)
      ) : (
        <div>{t('noPostsFound')}</div>
      )}
    </div>
  )
}