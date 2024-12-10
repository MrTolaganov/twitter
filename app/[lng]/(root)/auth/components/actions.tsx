'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useTranslate from '@/hooks/use-translate'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import SignUpForm from '@/components/forms/sign-up.form'
import SignInForm from '@/components/forms/sign-in-form'
import { signIn } from 'next-auth/react'
import { useParams } from 'next/navigation'

export default function Actions() {
  const { t } = useTranslate()
  const { lng } = useParams()

  return (
    <div className='flex flex-col gap-y-12'>
      <h1 className='text-4xl md:text-6xl font-bold'>{t('happeningNow')}</h1>
      <div className='flex flex-col gap-y-8'>
        <h3 className='text-2xl md:text-3xl font-bold'>{t('joinToday')}</h3>
        <div className='flex flex-col gap-y-2 md:w-1/2'>
          <Button
            size={'lg'}
            className='h-12 rounded-full flex justify-between items-center'
            onClick={() => signIn('github', { callbackUrl: `/${lng}/home` })}
          >
            <span className='font-semibold text-lg'>{t('signUpWithGithub')}</span>
            <FaGithub />
          </Button>
          <Button
            size={'lg'}
            className='h-12 rounded-full flex justify-between items-center'
            onClick={() => signIn('google', { callbackUrl: `/${lng}/home` })}
          >
            <span className='font-semibold text-lg'>{t('signUpWithGoogle')}</span>
            <FcGoogle />
          </Button>
          <div className='flex items-center gap-x-2 justify-between'>
            <Separator className='w-[45%]' />
            <span className='text-sm text-muted-foreground'>{t('or')}</span>
            <Separator className='w-[45%]' />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size={'lg'}
                className='h-12 rounded-full bg-blue-400/80 text-white text-lg hover:bg-blue-400/80'
              >
                {t('createAccount')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className='text-center'>{t('createAccount')}</DialogTitle>
              <SignUpForm />
            </DialogContent>
          </Dialog>
          <span className='text-xs text-muted-foreground'>
            {t('authRule')}{' '}
            <Link
              href={'https://x.com/en/tos'}
              target='_blank'
              className='text-blue-400/80 hover:underline'
            >
              {t('termsOfServices')}
            </Link>{' '}
            {t('and')}{' '}
            <Link
              href={'https://x.com/en/privacy'}
              target='_blank'
              className='text-blue-400/80 hover:underline'
            >
              {t('privacyPolicy')}
            </Link>{' '}
            , {t('including')}{' '}
            <Link
              href={'https://help.x.com/en/rules-and-policies/x-cookies'}
              target='_blank'
              className='text-blue-400/80 hover:underline'
            >
              {t('cookieUse')}
            </Link>
            .
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-y-6 md:w-1/2'>
        <div className='text-lg font-semibold'>{t('alreadyHaveAcc')}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size={'lg'}
              variant={'outline'}
              className='h-12 rounded-full text-blue-400/80 hover:text-blue-400/80 text-lg'
            >
              {t('signIn')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{t('signIn')}</DialogTitle>
            <SignInForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
