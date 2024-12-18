'use client'

import { getPopularPosts } from '@/actions/post.action'
import LoadingPostCard from '@/components/cards/loading-post.card'
import PostCard from '@/components/cards/post.card'
import useTranslate from '@/hooks/use-translate'
import { IPost } from '@/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function PopularPosts() {
  const [popularPosts, setPopularPosts] = useState<IPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const { t } = useTranslate()

  const onGetPopularPosts = () => {
    getPopularPosts(session?.currentUser._id!)
      .then(({ popularPosts }) => setPopularPosts(popularPosts))
      .catch(() => toast.error(t('somethingWentWrong')))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    onGetPopularPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='pt-[112px] md:pt-[56px] pb-[49px] md:pb-0'>
      {isLoading ? (
        Array.from({ length: 8 }).map((_, idx) => <LoadingPostCard key={idx} />)
      ) : popularPosts.length > 0 ? (
        popularPosts.map(post => <PostCard key={post._id} post={post} />)
      ) : (
        <div>{t('noPostsFound')}</div>
      )}
    </div>
  )
}
