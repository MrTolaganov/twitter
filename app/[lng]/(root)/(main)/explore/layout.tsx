import { LayoutProps } from '@/types'
import TabBar from './components/tab-bar'
import GlobalSearch from '@/components/shared/global-search'

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <GlobalSearch />
      <TabBar />
      <main>{children}</main>
    </>
  )
}
