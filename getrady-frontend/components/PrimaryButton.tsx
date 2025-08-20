import React from 'react'
import { Text, Pressable } from 'react-native'

type Variant = 'indigo' | 'emerald'

interface Props {
  label: string
  onPress: () => void
  disabled?: boolean
  variant?: Variant
}

const colors: Record<Variant, string> = {
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-600',
}

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'indigo',
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${colors[variant]} rounded-2xl py-4 items-center mt-2 ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <Text className="text-white font-semibold text-lg">{label}</Text>
    </Pressable>
  )
}