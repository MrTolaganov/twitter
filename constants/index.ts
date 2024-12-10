import { Bell, Home, Mail, Search, Settings } from 'lucide-react'

export const sidebarLinks = [
  { name: 'home', path: '/home', icon: Home },
  { name: 'explore', path: '/explore', icon: Search },
  { name: 'notifications', path: '/notifications', icon: Bell },
  { name: 'messages', path: '/messages', icon: Mail },
  { name: 'settings', path: '/settings', icon: Settings },
]

export const langs = [
  { name: 'english', value: 'en' },
  { name: 'russian', value: 'ru' },
  { name: 'turkish', value: 'tr' },
  { name: 'uzbek', value: 'uz' },
]
