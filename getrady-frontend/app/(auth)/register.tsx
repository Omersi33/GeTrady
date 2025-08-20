import React from 'react'
import {
  SafeAreaView, View, Text, TextInput,
  TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { Feather } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import { sha1 } from '../../utils/hash'
import { Link, router } from 'expo-router'
import BirthPicker from '../../components/BirthPicker'
import InputRow from '@/components/InputRow'
import FilledButton from '@/components/FilledButton'

const dateRx = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

const schema = z.object({
  name: z.string()
            .min(2, '2 caractères minimum'),
  email: z.string()
            .nonempty('Adresse mail invalide')
            .email('Adresse mail invalide'),
  birth: z.string()
            .nonempty('La date de naissance est obligatoire')
            .regex(dateRx, 'La date de naissance est obligatoire'),
  password: z.string()
            .min(8, '8 caractères minimum')
            .refine(v => /[A-Za-z]/.test(v), { message: '1 lettre minimum' })
            .refine(v => /[0-9]/.test(v), { message: '1 chiffre minimum' }),
})
type Form = z.infer<typeof schema>

export default function RegisterScreen() {
  const { register: create } = useAuth()

  const {
    control, handleSubmit, setError,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (d: Form) => {
    try {
      await create({ ...d, password: await sha1(d.password) })
      router.replace('/')
    } catch (err: any) {
      const message: string = err?.response?.data?.message || err.message || ''
      if (message.includes('déjà utilisée')) {
        setError('email', { type: 'server', message: 'Cette adresse mail est déjà utilisée.' })
      } else {
        Alert.alert('Erreur', 'Un problème est survenu.')
      }
    }
  }

  const theme = useColorScheme() ?? 'light'
  const bg = Colors[theme].background
  const txt = Colors[theme].text
  const styles = makeStyles(theme, txt)

  const ErrorText = ({ msg }: { msg?: string }) =>
    msg ? <Text style={styles.error}>{msg}</Text> : null

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }] }>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Créer un compte</Text>

            {/** ───── Nom ───── */}
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <InputRow
                  icon="user"
                  placeholder="Nom"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.name && <ErrorText msg={errors.name.message} />}

            {/** ───── Email ───── */}
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

            {/** ───── Date de naissance ───── */}
            <Controller
                control={control}
                name="birth"
                render={({ field: { value, onChange } }) => (
                    <BirthPicker value={value} onChange={onChange} />
                )}
            />
            {errors.birth && <Text style={styles.error}>{errors.birth.message}</Text>}

            {/** ───── Password ───── */}
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
            {errors.password && <ErrorText msg={errors.password.message} />}

            {/** ───── Bouton ───── */}
            <FilledButton
              label={isSubmitting ? 'Création…' : 'S’inscrire'}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              variant="emerald"
            />

            {/** ───── Lien vers login ───── */}
            <Link href="../login" asChild>
              <TouchableOpacity>
                <Text style={{ color: theme === 'light' ? '#047857' : '#10b981', textAlign: 'center', marginTop: 16 }}>
                  J’ai déjà un compte
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

/* ---------- Sous-composants utilitaires ---------- */

/* ---------- Styles ---------- */
function makeStyles(theme: 'light' | 'dark', txt: string) {
 return StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex:1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: txt },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  icon: { marginHorizontal: 4 },
  input: { flex: 1, height: 44, fontSize: 16, color: '#333' },
  error: { color: '#ef4444', marginBottom: 8, marginLeft: 4 },
  linkWrap: { marginTop: 12, alignItems: 'center' },
  link: { color: theme === 'light' ? '#047857' : '#10b981', fontSize: 16 },
})
}