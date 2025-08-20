import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useColorScheme } from './useColorScheme'
import Colors from '@/constants/Colors'

interface Props {
  icon: React.ComponentProps<typeof Feather>['name']
  placeholder: string
  value: string
  onChange: (txt: string) => void
  secure?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad'
  allowDecimal?: boolean
}

export default function InputRow({
  icon,
  placeholder,
  value,
  onChange,
  secure = false,
  keyboardType = 'default',
  allowDecimal = false,
  ...rest
}: Props) {
  const [hide, setHide] = useState(secure)

  const theme = useColorScheme() ?? 'light'
  const border = theme === 'light' ? '#ddd' : '#555'
  const iconColor = theme === 'light' ? '#777' : '#bbb'
  const textColor = Colors[theme].text

  return (
    <View style={[styles.row, { borderColor: border }] }>
      <Feather name={icon} size={20} color={iconColor} style={styles.icon} />

      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={theme === 'light' ? '#9ca3af' : '#6b7280'}
        value={value}
        onChangeText={txt => {
          if (keyboardType === 'numeric' || keyboardType === 'number-pad') {
            if (allowDecimal) {
              // autoriser un seul point décimal
              txt = txt.replace(/[^0-9.]/g, '')
              const parts = txt.split('.')
              if (parts.length > 2) {
                txt = parts[0] + '.' + parts.slice(1).join('')
              }
            } else {
              // interdit les décimales => chiffres seulement
              txt = txt.replace(/[^0-9]/g, '')
            }
          }
          onChange(txt)
        }}
        keyboardType={keyboardType}
        autoCapitalize="none"
        secureTextEntry={hide}
      />

      {secure && (
        <TouchableOpacity onPress={() => setHide(!hide)}>
          <Feather
            name={hide ? 'eye-off' : 'eye'}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 8,
    height: 44,
  },
  icon: { marginHorizontal: 4 },
  input: { flex: 1, fontSize: 16, color: '#333' },
})