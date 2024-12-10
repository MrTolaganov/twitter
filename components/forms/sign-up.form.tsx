'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkUser } from '@/actions/user.action'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle, Dot } from 'lucide-react'
import { toast } from 'sonner'
import VerifyForm from './verify.form'
import { DialogDescription } from '../ui/dialog'
import { sendOtp } from '@/lib/mail'
import useTranslate from '@/hooks/use-translate'

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [step, setStep] = useState<'step1' | 'step2'>('step1')
  const [userData, setUserData] = useState({ fullName: '', email: '' })
  const { t } = useTranslate()

  const signUpSchema = z.object({
    fullName: z.string().min(2, { message: t('mustBeFullName') }),
    email: z.string().email({ message: t('invalidEmail') }),
  })

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '' },
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true)
      await checkUser(values.email)
      const promise = sendOtp(values.email).then(() => {
        setStep('step2')
        setUserData(values)
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
      <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={signUpForm.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <Label>{t('fullName')}</Label>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder='Otabek Tulaganov'
                    className={'h-12 bg-secondary rounded-md'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <Label>{t('email')}</Label>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder='tulaganovok04@gmail.com'
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
      <VerifyForm fullName={userData.fullName} email={userData.email} />
    </>
  )
}
