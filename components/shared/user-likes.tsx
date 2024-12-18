'use client'

import { formatPostTime } from '@/lib/utils'
import { IPost } from '@/types'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import parse from 'html-react-parser'
import useTranslate from '@/hooks/use-translate'

interface Props {
  userLikes: IPost[]
}

export default function UserLikes({ userLikes }: Props) {
  const { lng } = useParams()
  const { t } = useTranslate()

  return (
    <div className='px-4'>
      {userLikes.length > 0 ? (
        userLikes.map(post => (
          <Link
            key={post._id}
            href={`/${lng}/post/${post._id}`}
            className='block border-b border-muted-foreground py-4'
          >
            <div className='flex gap-x-4 pb-4'>
              <div className='prose dark:prose-invert flex-1'>{parse(post.text)}</div>
              <span className='text-muted-foreground'>
                &#x2022; {formatPostTime(formatDistanceToNowStrict(post.createdAt))}
              </span>
            </div>
            {post.image && <Image src={post.image} alt='Post image' width={500} height={500} />}
          </Link>
        ))
      ) : (
        <div className='text-center'>{t('noLikesFound')}</div>
      )}
    </div>
  )
}
