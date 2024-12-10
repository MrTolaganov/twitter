import { getChatContacts } from '@/actions/chat.action'
import Header from '../components/header'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import MessagesList from './components/messages-list'

export default async function Page() {
  const session = await getServerSession(nextAuthOptions)
  const { contacts } = await getChatContacts(session?.currentUser._id!)
  // await getChatContacts(session?.currentUser._id!)

  return (
    <>
      <div className='max-md:h-[8vh]'>
        <Header />
      </div>
      <MessagesList contacts={contacts} />
    </>
  )
}
