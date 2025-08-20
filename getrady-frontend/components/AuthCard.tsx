import React, { ReactNode } from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-indigo-50 justify-center px-6"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md self-center bg-white rounded-3xl shadow-xl p-8">
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}