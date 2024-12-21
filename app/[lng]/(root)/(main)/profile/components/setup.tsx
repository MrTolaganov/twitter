'use client'

import { updateProfile } from '@/actions/user.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDialog } from '@/hooks/use-dialog'
import useTranslate from '@/hooks/use-translate'
import { UploadButton } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { IUser } from '@/types'
import { ArrowLeft, Camera, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SetUp() {
  const [step, setStep] = useState(1)
  const { data: session, update } = useSession()
  const { openedProfileDialog, setOpenedProfileDialog } = useDialog()
  const { t } = useTranslate()
  const [userData, setUserData] = useState<Partial<IUser>>({} as IUser)
  const [isLoading, setIsLoading] = useState(false)

  const onClose = () => {
    setOpenedProfileDialog(false)
    setStep(1)
    setUserData(session?.currentUser as IUser)
  }

  const onSave = async () => {
    try {
      setIsLoading(true)
      const promise = updateProfile(session?.currentUser._id!, userData).then(() => {
        update()
        setOpenedProfileDialog(false)
        setStep(1)
      })
      toast.promise(promise, {
        loading: t('loading'),
        success: t('profileUpdatedSuccessfully'),
        error: t('somethingWentWrong'),
      })
    } catch (error: any) {
      toast.error(error.message as string)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setUserData(session?.currentUser as IUser)
  }, [session?.currentUser])

  return (
    <Dialog open={openedProfileDialog}>
      <DialogContent>
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>{t('pickProfilePicture')}</DialogTitle>
              <DialogDescription>{t('profilePictureDescription')}</DialogDescription>
            </DialogHeader>
            <div className='relative h-72'>
              <Image
                src={
                  userData?.profileImage ||
                  'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                }
                alt={'Profile image'}
                width={200}
                height={200}
                className='rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 object-cover'
                priority
              />
              <UploadButton
                endpoint={'imageUploader'}
                onClientUploadComplete={res =>
                  setUserData(prev => ({ ...prev, profileImage: res[0].url }))
                }
                config={{ appendOnPaste: true, mode: 'auto' }}
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-full bg-transparent focus:outline-none'
                appearance={{
                  allowedContent: { display: 'none' },
                  button: {
                    width: 40,
                    height: 40,
                    borderRadius: '100%',
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                  },
                }}
                content={{ button: <Camera size={20} /> }}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <div className='flex items-center gap-x-4'>
                <Button size={'icon'} variant={'ghost'} onClick={() => setStep(prev => prev - 1)}>
                  <ArrowLeft />
                </Button>
                <DialogTitle>{t('pickHeader')}</DialogTitle>
              </div>
              <DialogDescription>{t('pickHeaderDescription')}</DialogDescription>
            </DialogHeader>
            <div className='h-72'>
              <div className='relative h-36 bg-secondary'>
                {userData?.backgroundImage && (
                  <div className='w-full h-24'>
                    <Image
                      src={userData.backgroundImage!}
                      alt={'Background image'}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                )}
                <UploadButton
                  endpoint={'imageUploader'}
                  onClientUploadComplete={res =>
                    setUserData(prev => ({ ...prev, backgroundImage: res[0].url }))
                  }
                  config={{ appendOnPaste: true, mode: 'auto' }}
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-full bg-transparent focus:outline-none'
                  appearance={{
                    allowedContent: { display: 'none' },
                    button: {
                      width: 40,
                      height: 40,
                      borderRadius: '100%',
                      backgroundColor: 'transparent',
                      border: '2px solid white',
                    },
                  }}
                  content={{ button: <Camera size={20} /> }}
                />
                <Image
                  src={
                    userData?.profileImage ||
                    'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                  }
                  alt={'Profile image'}
                  width={100}
                  height={100}
                  priority
                  className='rounded-full absolute left-8 -bottom-1/3 z-50 object-cover'
                />
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <DialogHeader>
              <div className='flex items-center gap-x-4'>
                <Button size={'icon'} variant={'ghost'} onClick={() => setStep(prev => prev - 1)}>
                  <ArrowLeft />
                </Button>
                <DialogTitle>{t('describeYourself')}</DialogTitle>
              </div>
              <DialogDescription>{t('bioDescription')}</DialogDescription>
            </DialogHeader>
            <div className='space-y-2 h-72'>
              <Label htmlFor='bio'>{t('yourBio')}</Label>
              <Textarea
                id='bio'
                rows={5}
                placeholder={t('typeYourself')}
                className='bg-secondary'
                value={userData?.bio}
                onChange={e => setUserData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <DialogHeader>
              <div className='flex items-center gap-x-4'>
                <Button size={'icon'} variant={'ghost'} onClick={() => setStep(prev => prev - 1)}>
                  <ArrowLeft />
                </Button>
                <DialogTitle>{t('whereDoYouLive')}</DialogTitle>
              </div>
              <DialogDescription>{t('findAccountsThroughLocation')}</DialogDescription>
            </DialogHeader>
            <div className='space-y-2 h-72'>
              <Label htmlFor='location'>Location</Label>
              <Input
                placeholder={t('locationPlaceholder')}
                className='h-12 bg-secondary'
                value={userData?.location || ''}
                onChange={e => setUserData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <Button
              className='absolute rounded-none'
              size={'icon'}
              variant={'ghost'}
              disabled={isLoading}
              onClick={onClose}
            >
              <X size={14} />
            </Button>
            <DialogHeader className='h-96'>
              <div className='flex items-center justify-center flex-col gap-y-8 h-full'>
                <DialogTitle>{t('clickToSaveUpdates')}</DialogTitle>
                <Button className='rounded-full h-12 w-1/2' disabled={isLoading} onClick={onSave}>
                  {t('save')}
                </Button>
              </div>
            </DialogHeader>
          </>
        )}
        <Button
          className={cn('rounded-full h-12', step === 5 && 'hidden')}
          onClick={() => setStep(prev => prev + 1)}
        >
          {t('next')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
