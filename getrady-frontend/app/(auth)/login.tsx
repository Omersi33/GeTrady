import React, { useState } from 'react'
import {
  SafeAreaView, View, Text, TextInput,
  TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import InputRow from '@/components/InputRow'
import { Feather } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { FieldError, UseFormSetError } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import { sha1 } from '../../utils/hash'
import { Link, router } from 'expo-router'
import FilledButton from '@/components/FilledButton'

const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(6, 'Min. 6 caractères'),
})
type Form = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const { login } = useAuth()
  const [hide, setHide] = useState(true)

  const { control, handleSubmit, setError,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async ({ email, password }: Form) => {
    try {
      const hash = await sha1(password)
      await login({ email, password: hash })
      router.replace('/');
    } catch (err: any) {
      const message: string = err?.response?.data?.message || err.message || ''
      if (message.includes('Adresse mail inexistante')) {
        setError('email', { type: 'server', message: 'Adresse mail inexistante' })
      } else if (message.includes('Mot de passe incorrect')) {
        setError('password', { type: 'server', message: 'Mot de passe incorrect' })
      } else {
        Alert.alert('Erreur', 'Un problème est survenu.')
      }
    }
  }

  const theme = useColorScheme() ?? 'light'
  const bg = Colors[theme].background
  const txt = Colors[theme].text

  const styles = makeStyles(theme, txt)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }] }>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Se connecter</Text>

            {/* email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <InputRow
                  icon="mail"
                  placeholder="Email"
                  keyboardType="email-address"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            {/* password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <InputRow
                  icon="lock"
                  placeholder="Mot de passe"
                  secure
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            {/* submit */}
            <FilledButton
              label={isSubmitting ? 'Connexion…' : 'Se connecter'}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              variant="indigo"
            />

            {/* link via Link */}
            <Link href="/register" asChild>
              <TouchableOpacity style={styles.linkContainer}>
                <Text style={styles.link}>Créer un compte</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function makeStyles(theme: 'light' | 'dark', txt: string) {
  return StyleSheet.create({
    flex:      { flex: 1 },
    safe:      { flex: 1 },
    container: { flexGrow: 1, justifyContent: 'center', padding: 16 },
    card:      {
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius:    12,
      padding:         24,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.1,
      shadowRadius:    4,
      elevation:       4,
    },
    title:           { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: txt },
    // inputRow / icon / input styles retirés (gérés par InputRow)
    error:           { color: '#ef4444', marginBottom: 8, marginLeft: 4 },
    linkContainer:   { marginTop: 12, alignItems: 'center' },
    link:            { color: theme === 'light' ? '#1e40af' : '#60a5fa', fontSize: 16 },
  })
}