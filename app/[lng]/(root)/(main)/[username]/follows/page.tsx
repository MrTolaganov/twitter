import FollowsTabs from './components/follows-tabs'
import { getUserFollowers, getUserFollowings } from '@/actions/follow.action'

interface Props {
  params: Promise<{ username: string }>
}

export default async function Page({ params }: Props) {
  const { username } = await params
  const { followings } = await getUserFollowings(`@${username.slice(3)}`)
  const { followers } = await getUserFollowers(`@${username.slice(3)}`)

  return (
    <>
      <FollowsTabs followings={followings} followers={followers} />
    </>
  )
}
