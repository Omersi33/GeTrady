import { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { AuthProvider, useAuth } from '../context/AuthContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Bootstrap />
    </AuthProvider>
  )
}

function Bootstrap() {
  const { user, isLoading } = useAuth()
  const router = useRouter();
  const segments = useSegments();
  const theme = useColorScheme() ?? 'light'

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      router.replace('/login');
    }
  }, [isLoading, user, segments]);

  // Plus aucune redirection automatique ici :
  // Les écrans (login / register) se chargent de router.replace('/') après succès.

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors[theme].background }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    )
  }

  return <Slot />
}