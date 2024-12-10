import { getUserById } from '@/actions/user.action'
import Header from './components/header'
import Body from './components/body'
import { getUsersChat, markAsRead } from '@/actions/chat.action'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'

interface Props {
  params: Promise<{ userId: string }>
}

export default async function Page({ params }: Props) {
  const { userId } = await params
  const { user } = await getUserById(userId)
  const session = await getServerSession(nextAuthOptions)
  const { chats } = await getUsersChat(session?.currentUser._id!, userId)
  await markAsRead(session?.currentUser._id!, userId)

  return (
    <>
      <div className='h-[57px]'>
        <Header {...user} />
      </div>
      <Body chats={chats} />
    </>
  )
}
