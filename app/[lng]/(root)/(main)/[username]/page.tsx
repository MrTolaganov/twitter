import { getDetailedUser } from '@/actions/user.action'
import Hero from './components/hero'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import About from './components/about'
import ProfileTabs from './components/profile-tabs'
import { getUserFollowers, getUserFollowings } from '@/actions/follow.action'

interface Props {
  params: Promise<{ username: string; lng: string }>
}

export default async function Page({ params }: Props) {
  const { username, lng } = await params
  const { user } = await getDetailedUser(`@${username.slice(3)}`)
  const session = await getServerSession(nextAuthOptions)
  const { followings } = await getUserFollowings(`@${username.slice(3)}`)
  const { followers } = await getUserFollowers(`@${username.slice(3)}`)

  if (`@${username.slice(3)}` === session?.currentUser.username) return redirect(`/${lng}/profile`)

  return (
    <>
      <Hero {...user} />
      <About user={user} numFollowings={followings.length} numFollowers={followers.length} />
      <ProfileTabs />
    </>
  )
}
