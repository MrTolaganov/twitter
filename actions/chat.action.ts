'use server'

import { connectDatabase } from '@/lib/mongoose'
import Chat from '@/models/chat.model'
import User from '@/models/user.model'
import { IChat, IUser } from '@/types'

export async function sendChatMessage(
  message: string,
  image: string,
  senderId: string,
  receiverId: string
) {
  try {
    await connectDatabase()
    const newChat = await Chat.create({ message, image, sender: senderId, receiver: receiverId })
    const chat = await Chat.findById(newChat._id).populate('sender receiver')
    return { chat: JSON.parse(JSON.stringify(chat)) as IChat }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getUsersChat(senderId: string, receiverId: string) {
  try {
    await connectDatabase()
    const chats = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).populate('sender receiver')
    return { chats: JSON.parse(JSON.stringify(chats)) as IChat[] }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function getChatContacts(userId: string) {
  try {
    await connectDatabase()
    const allUsers = await User.find({ _id: { $ne: userId } })
    const allContacts: any[] = []

    for (const user of allUsers) {
      const lastMessage = await Chat.findOne({
        $or: [
          { sender: userId, receiver: user._id },
          { sender: user._id, receiver: userId },
        ],
      })
        .populate('sender receiver')
        .sort({ createdAt: -1 })
      allContacts.push({ ...user._doc, lastMessage })
    }

    return {
      contacts: JSON.parse(
        JSON.stringify(
          allContacts
            .filter(contact => contact.lastMessage)
            .sort((a, b) => b.lastMessage.updatedAt - a.lastMessage.updatedAt)
        )
      ) as IUser[],
    }
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function markAsRead(receiverId: string, senderId: string) {
  try {
    await connectDatabase()
    await Chat.updateMany({ receiver: receiverId, sender: senderId }, { isRead: true })
  } catch (error) {
    throw new Error(error as string)
  }
}

export async function hasUnreadMessages(userId: string) {
  try {
    await connectDatabase()
    const userUnreadMessages = await Chat.find({ $and: [{ receiver: userId, isRead: false }] })
    const hasUnreadMessage = userUnreadMessages.length > 0
    return { hasUnreadMessage }
  } catch (error) {
    throw new Error(error as string)
  }
}
