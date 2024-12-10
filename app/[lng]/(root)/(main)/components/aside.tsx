import WhoFollowCard from '@/components/cards/who-follow.card'
import { IUser } from '@/types'

export default function Aside({ users }: { users: IUser[] }) {
  return (
    <div className='h-[95vh] border-l border-primary max-md:hidden fixed bg-background left-[1000px] !z-50 top-[5vh] w-[calc(100vw-1000px)] p-4'>
      {users.length > 0 && <WhoFollowCard users={users} />}
    </div>
  )
}
