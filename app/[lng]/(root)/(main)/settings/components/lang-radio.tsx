'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { langs } from '@/constants'
import useTranslate from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function LangRadio() {
  const { lng } = useParams()
  const { t } = useTranslate()

  return (
    <Card>
      <CardContent className='bg-secondary'>
        <CardTitle className='py-6'>{t('selectLanguage')}</CardTitle>
        <RadioGroup defaultValue={lng as string} className='space-y-2'>
          {langs.map(({ name, value }) => (
            <Link key={name} href={`/${value}/settings`} className='block'>
              <Label
                className={cn(
                  'py-4 px-2 rounded-md hover:bg-primary-foreground block cursor-pointer',
                  value === lng ? 'bg-primary-foreground' : 'bg-background'
                )}
                htmlFor={value}
              >
                <div className='flex items-center justify-between px-4'>
                  <div className='flex items-center space-x-4'>
                    <RadioGroupItem value={value} id={value} />
                    <div>{t(name)}</div>
                  </div>
                  <Image src={`/${value}.png`} alt={name!} width={20} height={20} />
                </div>
              </Label>
            </Link>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
