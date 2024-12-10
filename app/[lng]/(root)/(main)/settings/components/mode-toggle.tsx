'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import useTranslate from '@/hooks/use-translate'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslate()

  return (
    <Card>
      <CardContent className='flex items-center justify-between pt-4 bg-secondary'>
        <CardTitle>{t('themeMode')}</CardTitle>
        <div className='flex items-center gap-1'>
          <Moon />
          <Switch
            checked={theme === 'light' ? true : false}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <Sun />
        </div>
      </CardContent>
    </Card>
  )
}
