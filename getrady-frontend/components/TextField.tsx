import React, { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  icon: React.ComponentProps<typeof Feather>['name']
  placeholder: string
  value: string
  onChange: (txt: string) => void
  secure?: boolean
}

export default function TextField({
  icon,
  placeholder,
  value,
  onChange,
  secure,
}: Props) {
  const [hide, setHide] = useState(secure)
  return (
    <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 mb-4">
      <Feather name={icon} size={20} color="#6b7280" />
      <TextInput
        placeholder={placeholder}
        secureTextEntry={hide}
        autoCapitalize="none"
        value={value}
        onChangeText={onChange}
        className="flex-1 py-4 ml-2 text-base"
      />
      {secure && (
        <Pressable onPress={() => setHide(!hide)}>
          <Feather name={hide ? 'eye-off' : 'eye'} size={20} color="#6b7280" />
        </Pressable>
      )}
    </View>
  )
}