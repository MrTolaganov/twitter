import Header from '../components/header'
import TabBar from './components/tab-bar'

export default function Page() {
  return (
    <>
      <div className='h-[116px] md:h-[57px]'>
        <Header />
        <TabBar />
      </div>
      <div>Page</div>
    </>
  )
}
