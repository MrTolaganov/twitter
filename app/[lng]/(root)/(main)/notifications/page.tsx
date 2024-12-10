import Header from '../components/header'
import NotificationList from './components/notification-list'

export default async function Page() {
  return (
    <>
      <div className='max-md:h-[8vh]'>
        <Header />
      </div>
      <NotificationList />
    </>
  )
}
