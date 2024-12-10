'use server'

import { getCookieLng } from '@/lib/cookie'
import { connectDatabase } from '@/lib/mongoose'
import Follow from '@/models/follow.model'
import User from '@/models/user.model'
import { IUser } from '@/types'

export async function checkUser(email: string) {
  try {
    await connectDatabase()
    const { t } = await getCookieLng()
    const existedEmail = await User.findOne({ email })
    if (existedEmail) throw new Error(t('signedUpEmail'))
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function register(fullName: string, email: string) {
  try {
    await connectDatabase()
    await User.create({ fullName, email, username: `@${email.split('@').at(0)}` })
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function login(email: string) {
  try {
    await connectDatabase()
    const { t } = await getCookieLng()
    const existedUser = await User.findOne({ email })
    if (!existedUser) throw new Error(t('notSignedUp'))
    return { fullName: existedUser.fullName }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function updateProfile(_id: string, userData: Partial<IUser>) {
  try {
    await connectDatabase()
    const updatedUser = await User.findByIdAndUpdate(_id, userData, { new: true })
    return { user: JSON.parse(JSON.stringify(updatedUser)) as IUser }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getLastThreeUsers(userId: string) {
  try {
    await connectDatabase()
    let lastThreeUsers: any[] = []
    const allUsersExceptUserId = await User.find({ _id: { $ne: userId } })
    const allUsersExceptFollowerId = await Follow.find({ follower: userId })
      .select('following follower')
      .populate('following follower')

    if (allUsersExceptFollowerId.length) {
      let count: number = 0
      for (const user of allUsersExceptUserId) {
        let isPushed = true
        for (const u of allUsersExceptFollowerId) {
          const exceptUser = u.following._id.toString() === user._id.toString()
          if (exceptUser) {
            isPushed = false
            break
          }
        }
        if (isPushed) {
          lastThreeUsers.push(user)
          count++
        }
        if (count === 3) break
      }
    } else {
      lastThreeUsers = await User.find({ _id: { $ne: userId } })
        .sort({ createdAt: -1 })
        .limit(3)
    }

    return { users: JSON.parse(JSON.stringify(lastThreeUsers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getDetailedUser(username: string) {
  try {
    await connectDatabase()
    const user = await User.findOne({ username })
    return { user: JSON.parse(JSON.stringify(user)) as IUser }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDatabase()
    const user = await User.findById(userId)
    return { user: JSON.parse(JSON.stringify(user)) as IUser }
  } catch (error) {
    throw new Error(error as string)
  }
}
