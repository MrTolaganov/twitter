'use client'

import { useAlert } from '@/hooks/use-alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { deletePost } from '@/actions/post.action'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import useTranslate from '@/hooks/use-translate'

export default function AlertModal() {
  const { openedAlert, postId, setOpenedAlert } = useAlert()
  const router = useRouter()
  const { t } = useTranslate()
  const { lng } = useParams()

  const onDelete = () => {
    const promise = deletePost(postId)
      .then(() => router.push(`/${lng}/home`))
      .finally(() => setOpenedAlert(false))
    toast.promise(promise, {
      loading: t('loading'),
      success: t('postDeletedSuccessfully'),
      error: t('somethingWentWrong'),
    })
  }

  return (
    <AlertDialog open={openedAlert} onOpenChange={() => setOpenedAlert(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('alertDialogTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('alertDialogDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenedAlert(false)}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-500 text-white' onClick={onDelete}>
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
