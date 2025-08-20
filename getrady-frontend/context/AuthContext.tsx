// src/context/AuthContext.tsx
import React, { useState, useEffect, createContext, useContext } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { api } from '../services/api'
import type { User, RegisterDto, LoginDto } from '../types/auth'
// plus besoin de useRouter ici

interface AuthContextValue {
  user:    User | null
  isLoading: boolean
  login:   (credentials: LoginDto)    => Promise<void>
  register:(data: RegisterDto)        => Promise<void>
  logout:  ()                         => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        try {
          globalThis.token = token;
          const { data } = await api.get<User>('/users/me');
          setUser(data);
          await registerPushToken();
        } catch {
          await SecureStore.deleteItemAsync('token');
          globalThis.token = undefined;
        }
      }
      setLoading(false);
    })();
  }, []);

  /* -------- enregistrement push token -------- */
  async function registerPushToken() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId: (Constants.expoConfig as any)?.extra?.eas?.projectId });
      const pushToken = tokenData.data;
      if (pushToken) {
        await api.patch('/users/push-token', { token: pushToken });
      }
    } catch (err) {
      console.log('registerPushToken err', err);
    }
  }

  async function login({ email, password }: LoginDto) {
    try {
      const { data } = await api.post<{ token: string; user: User }>('/users/login', {
        email,
        password,
      })
      await SecureStore.setItemAsync('token', data.token)
      globalThis.token = data.token
      setUser(data.user)
      await registerPushToken();
      // redirection gérée par Bootstrap
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data ? JSON.stringify(err.response.data) : '') ||
        err.message ||
        'Connexion impossible'
      console.error('LOGIN ERR', err.response?.data)
      throw new Error(msg)
    }
  }

  async function register(payload: RegisterDto) {
    try {
      await api.post<null>('/users/register', payload)
      return login({ email: payload.email, password: payload.password })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? 'Inscription impossible'
      throw new Error(msg)
    }
  }

  async function logout() {
    console.log('>>> LOGOUT déclenché');
    await SecureStore.deleteItemAsync('token')
    globalThis.token = undefined
    setUser(null)
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}