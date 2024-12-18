import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPostTime(date: string) {
  const splittedDate = date.split(' ')
  return splittedDate.at(0)?.concat(splittedDate.at(1)?.at(0) as string)
}
