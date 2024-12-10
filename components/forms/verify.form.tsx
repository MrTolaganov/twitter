'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useState } from 'react'
import { verifyOtp } from '@/lib/mail'
import { signIn } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { register } from '@/actions/user.action'
import useTranslate from '@/hooks/use-translate'

interface Props {
  fullName: string
  email: string
  signedUp?: boolean
}

export default function VerifyForm({ fullName, email, signedUp }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { lng } = useParams()
  const { t } = useTranslate()

  const verifySchema = z.object({
    otp: z.string().length(6, { message: t('mustBeCode') }),
  })

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: '' },
  })

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    try {
      setIsLoading(true)
      await verifyOtp(email, values.otp)
      if (!signedUp) {
        await register(fullName!, email)
      }
      const promise = signIn('credentials', { fullName, email, callbackUrl: `/${lng}/home` }).then(
        () => setErrorMessage('')
      )
      toast.promise(promise, {
        loading: t('loading'),
        success: t('verifiedAuthorization'),
        error: t('somethingWentWrong'),
      })
    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {errorMessage && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Form {...verifyForm}>
        <form onSubmit={verifyForm.handleSubmit(onSubmit)} className='space-y-4'>
          <FormItem>
            <Label>{t('email')}</Label>
            <FormControl>
              <Input disabled value={email} className={'h-12 bg-secondary rounded-md'} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormField
            control={verifyForm.control}
            name='otp'
            render={({ field }) => (
              <FormItem className='w-full'>
                <Label>{t('verifyCode')}</Label>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                    className='w-full'
                    disabled={isLoading}
                  >
                    <InputOTPGroup className='w-full space-x-2'>
                      <InputOTPSlot index={0} className='w-full h-12 bg-secondary text-lg' />
                      <InputOTPSlot index={1} className='w-full h-12 bg-secondary text-lg' />
                      <InputOTPSlot index={2} className='w-full h-12 bg-secondary text-lg' />
                      <InputOTPSlot index={3} className='w-full h-12 bg-secondary text-lg' />
                      <InputOTPSlot index={4} className='w-full h-12 bg-secondary text-lg' />
                      <InputOTPSlot index={5} className='w-full h-12 bg-secondary text-lg' />
                    </InputOTPGroup>
                  </InputOTP>
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
  )
}
