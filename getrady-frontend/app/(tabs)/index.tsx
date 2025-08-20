import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text, SafeAreaView, Alert, TextInput, Modal } from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { AssetService } from '@/services/AssetService'
import type { Asset } from '@/types/asset'
import { AssetCard } from '@/components/AssetCard'
import { useAuth } from '@/context/AuthContext'
import InputRow from '@/components/InputRow';
import Feather from '@expo/vector-icons/Feather';
import FilledButton from '@/components/FilledButton';
import ConfigModal from '@/components/ConfigModal'

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light'
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth();
  const [symbol, setSymbol] = useState('');

  const [showCfg, setShowCfg] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { logout } = useAuth()

  useEffect(() => {
    let isMounted = true;

    async function fetchAssets() {
      if (isEditing) return;   // on ne remplace pas la liste pendant l’édition
      try {
        const data = await AssetService.list();
        if (isMounted) setAssets(data);
      } catch {
        // ignore 404
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // première récupération
    fetchAssets();

    // rafraîchissement toutes les 5 s
    const intervalId = setInterval(fetchAssets, 1_000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isEditing])

  async function handleCfgSubmit(cfg: { maFast:number; maSlow:number; rsiLo:number; rsiHi:number; bbPeriod:number; bbStdDev:number }) {
    try {
      const nouvelActif = await AssetService.add(symbol.trim().toUpperCase(), cfg);
      setSymbol('');
      setShowCfg(false);
      setAssets(prev => [...prev, nouvelActif]);
    } catch (err:any) {
      const msg = err?.response?.data?.message ?? err.message;
      Alert.alert('Erreur', msg);
    }
  }

  const removeFromList = (id: number) =>
    setAssets(prev => prev.filter(a => a.id !== id));

  if (loading) {
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: Colors[theme].background }] }>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    )
  }

  if (!loading && assets.length === 0) {
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: Colors[theme].background }] }>
        <Text style={{ color: Colors[theme].text }}>Aucun actif disponible.</Text>
      </View>
    );
  }

  const dynStyles = {
    inputBorder: { borderColor: theme === 'light' ? '#ddd' : '#555' },
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: Colors[theme].background }] }>
      {user?.isAdmin && (
        <View style={styles.addRow}>
          <TextInput
            style={[
              styles.addInput,
              { color: Colors[theme].text },
              theme === 'dark' && { borderColor: '#555' },
            ]}
            placeholder="Symbole"
            placeholderTextColor={theme === 'light' ? '#9ca3af' : '#6b7280'}
            value={symbol}
            onChangeText={setSymbol}
            maxLength={20}
            autoCapitalize="characters"
          />
          <View style={{ width: 110 }}>
            <FilledButton
              label="Ajouter"
              onPress={() => setShowCfg(true)}
              disabled={!symbol.trim()}
              variant="indigo"
            />
          </View>
        </View>
      )}
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AssetCard asset={item} onDeleted={removeFromList} />
        )}
      />

      <ConfigModal visible={showCfg} onCancel={()=>setShowCfg(false)} onSubmit={handleCfgSubmit} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  addRow:  { flexDirection:'row', alignItems:'center', gap:8, marginHorizontal:16, marginVertical:12 },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 44
  },
  // styles logout supprimés
  /* plus besoin des styles de card individuels */
})
