import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { UserService } from '@/services/UserService';
import type { User } from '@/types/auth';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';

export default function ListUsersScreen() {
  const { user } = useAuth();

  // Si l'utilisateur n'est pas admin, message d'accès refusé
  if (!user?.isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Accès réservé aux administrateurs.</Text>
      </View>
    );
  }

  const colorScheme = useColorScheme();
  const [users, setUsers]   = useState<User[]>([]);
  const [page, setPage]     = useState(1);
  const [total, setTotal]   = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async (pageToLoad: number = 1, searchTerm: string = search) => {
    try {
      setLoading(true);
      const res = await UserService.listUsers(pageToLoad, searchTerm);
      setUsers(res.users);
      setTotal(res.total);
      setPage(res.page);
    } catch (err: any) {
      console.error('ERR list users', err);
      Alert.alert('Erreur', err.message ?? 'Impossible de récupérer les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadUsers(1, search);
  }, [search, loadUsers]);

  function confirmDelete(user: User) {
    Alert.alert(
      'Confirmation',
      `Supprimer le compte de ${user.name || user.email} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(user.id);
              loadUsers(page, search);
            } catch (err: any) {
              Alert.alert('Erreur', err.message ?? 'Impossible de supprimer l’utilisateur');
            }
          },
        },
      ]
    );
  }

  const altBg = colorScheme === 'light' ? '#d1fae5' : '#064e3b';

  const renderItem = ({ item, index }: { item: User; index: number }) => {
    const isAlt = index % 2 === 1;
    return (
      <View style={[
        styles.row,
        isAlt && { backgroundColor: altBg },
      ]}>
        <Text style={[styles.cell, { width: 40, color: Colors[colorScheme ?? 'light'].text }]}>{index + 1 + (page - 1) * 50}</Text>
        <Text style={[styles.cell, { width: 45, color: Colors[colorScheme ?? 'light'].text }]}>{item.id}</Text>
        <Text style={[styles.cell, { flex: 1.3, color: Colors[colorScheme ?? 'light'].text }]}>{item.name || '—'}</Text>
        <Text style={[styles.cell, { width: 85, color: Colors[colorScheme ?? 'light'].text }]}>{item.birth ? new Date(item.birth).toLocaleDateString() : '—'}</Text>
        <Text style={[styles.cell, { flex: 2.2, borderRightWidth: 0, color: Colors[colorScheme ?? 'light'].text }]}>{item.email}</Text>
        <TouchableOpacity onPress={() => confirmDelete(item)} style={{ paddingHorizontal: 8 }}>
          <FontAwesome name="trash" size={20} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.headerRow]}>
      <Text style={[styles.headerCell, { width: 40 }]}>#</Text>
      <Text style={[styles.headerCell, { width: 45 }]}>ID</Text>
      <Text style={[styles.headerCell, { flex: 1.3 }]}>Nom</Text>
      <Text style={[styles.headerCell, { width: 85 }]}>Naissance</Text>
      <Text style={[styles.headerCell, { flex: 2.2, borderRightWidth: 0 }]}>Email</Text>
      <Text style={[styles.headerCell, { width: 32, borderRightWidth: 0 }]}></Text>
    </View>
  );

  const maxPage = Math.ceil(total / 50);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <TextInput
        style={[styles.searchInput, { borderColor: Colors[colorScheme ?? 'light'].tabIconDefault, color: Colors[colorScheme ?? 'light'].text }]}
        placeholder="Rechercher par nom ou email"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <View style={styles.pagination}>
        <TouchableOpacity disabled={page <= 1} onPress={() => loadUsers(page - 1, search)}>
          <FontAwesome name="chevron-left" size={24} color={page <= 1 ? '#ccc' : Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 16, color: Colors[colorScheme ?? 'light'].text }}>{page}</Text>
        <TouchableOpacity disabled={page >= maxPage} onPress={() => loadUsers(page + 1, search)}>
          <FontAwesome name="chevron-right" size={24} color={page >= maxPage ? '#ccc' : Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9ae6b4',
    paddingVertical: 6,
  },
  headerCell: {
    fontWeight: 'bold',
    paddingHorizontal: 4,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#ccc',
    color: '#000',
  },
  cell: {
    paddingHorizontal: 4,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
}); 