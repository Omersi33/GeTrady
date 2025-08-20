import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { router, type Href } from 'expo-router'

interface Props {
  to: Href
  label: string
  color?: string
}

export default function NavLink({ to, label, color = 'text-indigo-600' }: Props) {
  return (
    <TouchableOpacity onPress={() => router.push(to)} className="mt-4 items-center">
      <Text className={`${color} font-medium`}>{label}</Text>
    </TouchableOpacity>
  )
}