import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/context/AuthContext';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // removed auth redirection effect; handled elsewhere

  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor  : Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopColor : colorScheme === 'light' ? '#e5e7eb' : '#374151',
          borderTopWidth : StyleSheet.hairlineWidth,
        },
        headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
        headerTitleStyle: { color: Colors[colorScheme ?? 'light'].text },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Actifs',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

      <Tabs.Protected guard={!!user?.isAdmin}>
        <Tabs.Screen
          name="listUsers"
          options={{
            title: 'Utilisateurs',
            tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
