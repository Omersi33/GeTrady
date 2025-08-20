import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useAuth } from '@/context/AuthContext'
import FilledButton from '@/components/FilledButton'
import InputRow from '@/components/InputRow'
import BirthPicker from '@/components/BirthPicker'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api'
import { router } from 'expo-router'
import { Link } from 'expo-router'

const dateRx = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

const schema = z.object({
  name: z.string().min(2, '2 caractères minimum'),
  email: z.string().nonempty('Adresse mail invalide').email('Adresse mail invalide'),
  birth: z.string().nonempty('La date de naissance est obligatoire').regex(dateRx, 'La date de naissance est obligatoire'),
})
type Form = z.infer<typeof schema>

export default function AccountScreen() {
  const { user, logout } = useAuth()
  const theme = useColorScheme() ?? 'light'

  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name : user?.name  ?? '',
      email: user?.email ?? '',
      birth: user?.birth ?? '',
    }
  })

  const onSave = async (data: Form) => {
    try {
      await api.patch('/users/update', data)
      Alert.alert('Succès', 'Profil mis à jour')
    } catch (err: any) {
      const msg: string = err?.response?.data?.message || err.message || ''
      if (msg.includes('déjà utilisée')) {
        setError('email', { type: 'server', message: 'Cette adresse mail est déjà utilisée.' })
      } else {
        Alert.alert('Erreur', 'Un problème est survenu.')
      }
    }
  }

  async function handleDelete() {
    Alert.alert('Confirmation', 'Voulez-vous vraiment supprimer votre compte ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await api.delete('/users/delete')
            await logout()
            router.replace('/login')
          } catch {
            Alert.alert('Erreur', 'Un problème est survenu.')
          }
        }
      }
    ])
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors[theme].background }] }>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].background }] }>
        <Text style={[styles.title, { color: Colors[theme].text }]}>Mon compte</Text>

        {/* Nom */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <InputRow icon="user" placeholder="Nom" value={value} onChange={onChange} />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <InputRow icon="mail" placeholder="Email" value={value} onChange={onChange} keyboardType="email-address" />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        {/* Date de naissance */}
        <Controller
          control={control}
          name="birth"
          render={({ field: { value, onChange } }) => (
            <BirthPicker value={value} onChange={onChange} />
          )}
        />
        {errors.birth && <Text style={styles.error}>{errors.birth.message}</Text>}

        {/* Boutons */}
        <FilledButton
          label={isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
          onPress={handleSubmit(onSave)}
          disabled={isSubmitting}
          variant="emerald"
        />

        <FilledButton
          label="Modifier le mot de passe"
          onPress={() => router.push('/password')}
          variant="indigo"
        />

        <FilledButton
          label="Supprimer le compte"
          onPress={handleDelete}
          variant="red"
        />

        <FilledButton
          label="Se déconnecter"
          onPress={logout}
          variant="red"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  error: { color: '#d32f2f', marginBottom: 8, marginLeft: 4 },
}) 