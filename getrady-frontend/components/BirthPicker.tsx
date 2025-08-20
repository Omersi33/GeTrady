import React, { useState } from 'react'
import { View, TextInput, Pressable, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useColorScheme } from './useColorScheme'
import Colors from '@/constants/Colors'

const maxDate = dayjs().subtract(18, 'year').toDate()

export default function BirthPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = useState(false)

  const onSelect = (_: any, d?: Date) => {
    setShow(Platform.OS === 'ios')
    if (d) onChange(dayjs(d).format('YYYY-MM-DD'))
  }

  const theme = useColorScheme() ?? 'light'
  const border = theme === 'light' ? '#ddd' : '#555'
  const iconColor = theme === 'light' ? '#777' : '#bbb'
  const textColor = Colors[theme].text

  return (
    <>
      <Pressable onPress={() => setShow(true)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: border,
            borderRadius: 6,
            marginBottom: 12,
            paddingHorizontal: 8,
            height: 44,
          }}
        >
          <Feather name="calendar" size={20} color={iconColor} style={{ marginHorizontal: 4 }} />
          <TextInput
            style={{ flex: 1, fontSize: 16, color: textColor }}
            placeholder="JJ/MM/AAAA"
            placeholderTextColor={theme === 'light' ? '#9ca3af' : '#6b7280'}
            editable={false}
            value={value ? dayjs(value).format('DD/MM/YYYY') : ''}
            pointerEvents="none"
          />
        </View>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : maxDate}
          mode="date"
          display="spinner"
          maximumDate={maxDate}
          onChange={onSelect}
        />
      )}
    </>
  )
}