'use server'

import { nextAuthOptions } from '@/lib/auth-options'
import { connectDatabase } from '@/lib/mongoose'
import Follow from '@/models/follow.model'
import User from '@/models/user.model'
import { IUser } from '@/types'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export async function followAndUnfollow(followingId: string, followerId: string, path: string) {
  try {
    await connectDatabase()
    const isFollowingUser = await Follow.findOne({ following: followingId, follower: followerId })
    if (isFollowingUser) {
      await Follow.deleteOne({ following: followingId, follower: followerId })
    } else {
      await Follow.create({ following: followingId, follower: followerId })
    }
    revalidatePath(path)
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserFollowings(username: string) {
  try {
    await connectDatabase()
    const user = await User.findOne({ username })
    const userFollows = await Follow.find({ follower: user._id })
      .select('following')
      .populate('following')
    const userFollowings = userFollows.map(uf => uf.following)
    return { followings: JSON.parse(JSON.stringify(userFollowings)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserFollowers(username: string) {
  try {
    await connectDatabase()
    const user = await User.findOne({ username })
    const userFollows = await Follow.find({ following: user._id })
      .select('follower')
      .populate('follower')
    const userFollowers = userFollows.map(uf => uf.follower)
    return { followers: JSON.parse(JSON.stringify(userFollowers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function checkFollowingStatus(userId: string) {
  try {
    await connectDatabase()
    const session = await getServerSession(nextAuthOptions)
    const userFollows = await Follow.find({ following: userId })
      .select('follower')
      .populate('follower')
    const result = userFollows
      .map(userFollow => userFollow.follower._id.toString())
      .includes(session?.currentUser._id.toString())
    return { result }
  } catch (error) {
    throw new Error(error as string)
  }
}
