import { LayoutProps } from '@/types'
import Sidebar from './components/sidebar'
import Aside from './components/aside'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { getLastThreeUsers } from '@/actions/user.action'

export default async function Layout({ children, params }: LayoutProps) {
  const { lng } = await params
  const session = await getServerSession(nextAuthOptions)

  if (!session) return redirect(`/${lng}/auth`)

  const { users } = await getLastThreeUsers(session.currentUser._id)

  return (
    <>
      <Sidebar />
      <div className='pl-16 md:pl-[450px] max-md:w-full md:w-[1000px] mt-[5vh]'>{children}</div>
      <Aside users={users} />
    </>
  )
}
