import Header from '../components/header'
import LangRadio from './components/lang-radio'
import ModeToggle from './components/mode-toggle'

export default function Page() {
  return (
    <>
      <div className='max-md:h-[8vh]'>
        <Header />
      </div>
      <div className='p-4 space-y-4'>
        <ModeToggle />
        <LangRadio />
      </div>
    </>
  )
}
