import { getUserFollowers, getUserFollowings } from '@/actions/follow.action'
import About from './components/about'
import Hero from './components/hero'
import ProfileTabs from './components/profile-tabs'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth-options'
import Header from '../components/header'

export default async function Page() {
  const session = await getServerSession(nextAuthOptions)
  const { followings } = await getUserFollowings(session?.currentUser.username!)
  const { followers } = await getUserFollowers(session?.currentUser.username!)

  return (
    <>
      <div className='max-md:h-[8vh]'>
        <Header />
      </div>
      <Hero />
      <About numFollowings={followings.length} numFollowers={followers.length} />
      <ProfileTabs />
    </>
  )
}
