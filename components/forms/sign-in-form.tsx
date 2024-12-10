'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import VerifyForm from './verify.form'
import { DialogDescription } from '../ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle, Dot } from 'lucide-react'
import { login } from '@/actions/user.action'
import { sendOtp } from '@/lib/mail'
import { toast } from 'sonner'
import useTranslate from '@/hooks/use-translate'

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [step, setStep] = useState<'step1' | 'step2'>('step1')
  const [userData, setUserData] = useState({ fullName: '', email: '' })
  const { t } = useTranslate()

  const signInSchema = z.object({ email: z.string().email({ message: t('invalidEmail') }) })

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true)
      const { fullName } = await login(values.email)
      const promise = sendOtp(values.email).then(() => {
        setUserData({ fullName, email: values.email })
        setStep('step2')
        setErrorMessage('')
      })
      toast.promise(promise, {
        loading: t('loading'),
        success: t('emailSendSuccess'),
        error: t('somethingWentWrong'),
      })
    } catch (error: any) {
      setErrorMessage(error.message?.split(': ').at(1))
    } finally {
      setIsLoading(false)
    }
  }

  return step === 'step1' ? (
    <>
      <DialogDescription>{t('step1')}</DialogDescription>
      {errorMessage && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Form {...signInForm}>
        <form onSubmit={signInForm.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={signInForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <Label>{t('email')}</Label>
                <FormControl>
                  <Input
                    placeholder='tulaganovok04@gmail.com'
                    {...field}
                    disabled={isLoading}
                    className={'h-12 bg-secondary rounded-md'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' size={'lg'} className={'w-full'} disabled={isLoading}>
            {t('submit')}
          </Button>
        </form>
      </Form>
    </>
  ) : (
    <>
      <DialogDescription className='flex items-center gap-x-2'>
        <span className='text-foreground underline cursor-pointer' onClick={() => setStep('step1')}>
          {t('step1')}
        </span>
        <Dot className='text-foreground' />
        <span>{t('step2')}</span>
      </DialogDescription>
      <VerifyForm fullName={userData.fullName} email={userData.email} signedUp />
    </>
  )
}
