'use server'

import { connectDatabase } from '@/lib/mongoose'
import Follow from '@/models/follow.model'
import User from '@/models/user.model'
import { IUser } from '@/types'

export async function followAndUnfollow(followingId: string, followerId: string) {
  try {
    await connectDatabase()
    const isFollowingUser = await Follow.findOne({ following: followingId, follower: followerId })
    if (isFollowingUser) {
      await Follow.deleteOne({ following: followingId, follower: followerId })
    } else {
      await Follow.create({ following: followingId, follower: followerId })
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserFollowings(username: string) {
  try {
    await connectDatabase()
    const user = await User.findOne({ username })
    const userFollows = await Follow.find({ follower: user?._id })
      .select('following')
      .populate('following')
    const userFollowings = userFollows.map(uf => uf.following)
    const followingUsers: any[] = []
    if (userFollowings.length) {
      for (const userFollowing of userFollowings) {
        const followingUser = await Follow.findOne({
          $and: [{ follower: user._id }, { following: userFollowing._id }],
        })
        followingUsers.push({ ...userFollowing._doc, isFollowing: Boolean(followingUser) })
      }
    }

    return { followings: JSON.parse(JSON.stringify(followingUsers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUserFollowers(username: string) {
  try {
    await connectDatabase()
    const user = await User.findOne({ username })
    const userFollows = await Follow.find({ following: user?._id })
      .select('follower')
      .populate('follower')
    const userFollowers = userFollows.map(uf => uf.follower)
    const followerUsers: any[] = []
    if (userFollowers.length) {
      for (const userFollower of userFollowers) {
        const followingUser = await Follow.findOne({
          $and: [{ follower: user._id }, { following: userFollower._id }],
        })
        followerUsers.push({ ...userFollower._doc, isFollowing: Boolean(followingUser) })
      }
    }
    return { followers: JSON.parse(JSON.stringify(followerUsers)) as IUser[] }
  } catch (error) {
    throw new Error(error as string)
  }
}