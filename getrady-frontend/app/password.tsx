import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, Alert, View } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import InputRow from '@/components/InputRow'
import FilledButton from '@/components/FilledButton'
import { sha1 } from '@/utils/hash'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { router, useNavigation } from 'expo-router'
import { BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

const pwdSchema = z.object({
  oldPassword: z.string().nonempty('Mot de passe requis'),
  newPassword: z.string()
    .min(8, '8 caractères minimum')
    .refine(v => /[A-Za-z]/.test(v), { message: '1 lettre minimum' })
    .refine(v => /[0-9]/.test(v), { message: '1 chiffre minimum' }),
})

type Form = z.infer<typeof pwdSchema>

export default function PasswordScreen() {
  const { logout } = useAuth()
  const navigation = useNavigation()
  const theme = useColorScheme() ?? 'light'
  const bg = Colors[theme].background
  const txt = Colors[theme].text

  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(pwdSchema) })

  const onSubmit = async ({ oldPassword, newPassword }: Form) => {
    try {
      const payload = {
        oldPassword: await sha1(oldPassword),
        newPassword: await sha1(newPassword),
      }
      await api.patch('/users/change-password', payload)
      Alert.alert('Succès', 'Mot de passe mis à jour', [{ text: 'OK', onPress: () => router.back() }])
    } catch (err: any) {
      const msg: string = err?.response?.data?.message || err.message || ''
      if (msg.includes('Mot de passe incorrect')) {
        setError('oldPassword', { type: 'server', message: 'Mot de passe incorrect' })
      } else if (msg.includes('même')) {
        setError('newPassword', { type: 'server', message: 'Le nouveau mot de passe ne peut pas être le même que l\'ancien' })
      } else {
        Alert.alert('Erreur', 'Un problème est survenu.')
      }
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(tabs)/account')
        return true
      })
      return () => sub.remove()
    }, [])
  )

  React.useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => null,
      headerBackButtonMenuEnabled: false,
      gestureEnabled: false,
    })
  }, [])

  const styles = makeStyles(txt, bg)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Changer le mot de passe</Text>

          {/* Ancien */}
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { value, onChange } }) => (
              <InputRow icon="lock" placeholder="Ancien mot de passe" secure value={value} onChange={onChange} />
            )}
          />
          {errors.oldPassword && <Text style={styles.error}>{errors.oldPassword.message}</Text>}

          {/* Nouveau */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange } }) => (
              <InputRow icon="lock" placeholder="Nouveau mot de passe" secure value={value} onChange={onChange} />
            )}
          />
          {errors.newPassword && <Text style={styles.error}>{errors.newPassword.message}</Text>}

          <FilledButton
            label={isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            variant="emerald"
          />
      </ScrollView>
    </SafeAreaView>
  )
}

function makeStyles(txt: string, bg: string) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: bg },
    container: { padding: 16, paddingTop: 80 },
    card: {
      backgroundColor: bg === '#0d1117' ? '#111827' : '#ffffff',
      borderRadius: 12,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: txt },
    error: { color: '#ef4444', marginBottom: 8, marginLeft: 4 },
  })
} 