import { ReactNode } from 'react'

export interface ChildProps {
  children: ReactNode
}

export interface ServerLngParams {
  params: Promise<{ lng: string }>
}

export interface LayoutProps extends ServerLngParams, ChildProps {}

export interface LngParams {
  params: { lng: string }
}

export interface IUser {
  _id: string
  username: string
  email: string
  fullName: string
  bio: string
  location: string
  profileImage: string
  backgroundImage: string
  createdAt: string
  lastMessage: IChat
}

export interface IOtp {
  _id: string
  email: string
  otp: string
  expiredAt: Date
}

export interface IError extends Error {
  message: string
}

export interface INotification {
  _id: string
  message: string
  createdAt: Date
}

export interface IChat {
  _id: string
  message: string
  image?: string
  isRead: boolean
  sender?: IUser
  receiver: IUser
  createdAt: Date
}
