'use client'

import { IPost } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import parse from 'html-react-parser'
import { formatPostTime } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'
import useTranslate from '@/hooks/use-translate'

interface Props {
  userPosts: IPost[]
}

export default function UserPosts({ userPosts }: Props) {
  const { lng } = useParams()
  const { t } = useTranslate()

  return (
    <div className='px-4'>
      {userPosts.length > 0 ? (
        userPosts.map(({ _id, text, image, createdAt }) => (
          <Link
            key={_id}
            href={`/${lng}/post/${_id}`}
            className='block border-b border-muted-foreground py-4'
          >
            <div className='flex gap-x-4 pb-4'>
              <div className='prose dark:prose-invert flex-1'>{parse(text)}</div>
              <span className='text-muted-foreground'>
                &#x2022; {formatPostTime(formatDistanceToNowStrict(createdAt))}
              </span>
            </div>
            {image && <Image src={image} alt='image' width={500} height={500} />}
          </Link>
        ))
      ) : (
        <div className='text-center'>{t('noPostsFound')}</div>
      )}
    </div>
  )
}
