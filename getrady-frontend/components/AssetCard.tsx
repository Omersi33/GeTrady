import React, { useState, useRef } from 'react'
import ConfigModal from './ConfigModal';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Pressable } from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from './useColorScheme'
import type { Asset } from '@/types/asset'
import dayjs from 'dayjs'
import Feather from '@expo/vector-icons/Feather'
import { useAuth } from '@/context/AuthContext';
import InputRow from '@/components/InputRow';
import { Alert } from 'react-native';
import { AssetService } from '@/services/AssetService';
import FilledButton from '@/components/FilledButton';

interface Props {
  asset: Asset;
  onDeleted: (id:number)=>void;
}

export function AssetCard({ asset, onDeleted }: Props) {
  /* ---------- état + anim ---------- */
  const [expanded, setExpanded] = useState(false)
  const contentHeight = useRef(180)                               // hauteur réelle
  const anim = useRef(new Animated.Value(0)).current            // hauteur animée

  const toggle = () => {
    Animated.timing(anim, {
      toValue: expanded ? 0 : contentHeight.current,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start()
    setExpanded(!expanded)
  }

  const theme = useColorScheme() ?? 'light'

  const border =
    asset.advice === 'BUY' ? '#059669' : asset.advice === 'SELL' ? '#dc2626' : (theme === 'light' ? '#ddd' : '#444')

  const bgTint = asset.advice === 'BUY'
    ? (theme === 'light' ? '#e6f9f2' : '#0f3a2d')
    : asset.advice === 'SELL'
    ? (theme === 'light' ? '#fde8e8' : '#4a1414')
    : Colors[theme].background

  const headerTint = asset.advice === 'BUY'
    ? (theme === 'light' ? '#ccf3e5' : '#145239')
    : asset.advice === 'SELL'
    ? (theme === 'light' ? '#fbd5d5' : '#701c1c')
    : (theme === 'light' ? '#e5e7eb' : '#374151')

  const headerBg = asset.advice === 'BUY'
    ? (theme === 'light' ? '#e0f0e8' : '#1a332c')   // dark mode: un vert plus foncé
    : asset.advice === 'SELL'
    ? (theme === 'light' ? '#f9dada' : '#5a1a1a')   // dark mode: rouge plus foncé
    : (theme === 'light' ? '#e5e7eb' : '#374151');

  const { user } = useAuth();

  const [editModal, setEditModal] = useState(false);

  function confirmDelete() {
    Alert.alert('Confirmation', 'Supprimer cet actif ?', [
      { text:'Annuler', style:'cancel' },
      { text:'Supprimer', style:'destructive', onPress: async ()=>{
          await AssetService.delete(asset.id);
          onDeleted(asset.id);
      }}
    ]);
  }

  /* ---------- rendu ---------- */
  return (
    <View style={[styles.card, { borderColor: border, backgroundColor: bgTint }] }>
      {/* Header */}
      <TouchableOpacity style={[styles.header, { backgroundColor: headerBg }]} onPress={toggle}>
        <Text style={[styles.symbol,{flex:1, color: Colors[theme].text}]}>{asset.symbol}</Text>
        {user?.isAdmin && (
          <>
            <Pressable onPress={()=>setEditModal(true)} style={{ marginRight:8 }}>
              <Feather name="edit" size={18} color={Colors[theme].text} />
            </Pressable>
            <Pressable onPress={confirmDelete}>
              <Feather name="trash-2" size={18} color={Colors[theme].text} />
            </Pressable>
          </>
        )}
        <Feather name={expanded?'chevron-up':'chevron-down'} size={20} color={Colors[theme].text}/>
      </TouchableOpacity>

      {/* Corps animé */}
      <Animated.View style={{ height: anim, overflow: 'hidden' }}>
        <View
          style={[styles.body, { backgroundColor: bgTint }]}
          onLayout={e => {
            if (contentHeight.current === 0) {
              // première mesure : on stocke la hauteur et on garde fermé
              contentHeight.current = e.nativeEvent.layout.height
              anim.setValue(0)
            }
          }}
        >
          {/* … lignes Row … */}
          <Row label="Dernière mise à jour" value={asset.lastUpdate} textColor={Colors[theme].text} />
          <Row label="Valeur actuelle"   value={asset.currentValue} textColor={Colors[theme].text} />
          <Row label="Signal"            value={asset.advice} textColor={Colors[theme].text} />
          <Row label="TP1"               value={asset.TP1} textColor={Colors[theme].text} />
          <Row label="TP2"               value={asset.TP2} textColor={Colors[theme].text} />
          <Row label="TP3"               value={asset.TP3} textColor={Colors[theme].text} />
          <Row label="SL"                value={asset.SL} textColor={Colors[theme].text} />
        </View>
      </Animated.View>
      {/* edit modal */}
      {user?.isAdmin && (
        <ConfigModal
          visible={editModal}
          initial={{ maFast:asset.maFast, maSlow:asset.maSlow, rsiLo:asset.rsiLo, rsiHi:asset.rsiHi, bbPeriod: asset.bbPeriod, bbStdDev: asset.bbStdDev }}
          onCancel={()=>setEditModal(false)}
          onSubmit={async cfg=>{
            await AssetService.updateCfg(asset.id, cfg);
            Object.assign(asset, cfg);
            setEditModal(false);
          }}
         />
      )}
    </View>
  )
}

function Row({ label, value, textColor }: { label: string; value: any; textColor: string }) {
  let display = '–'
  if (value !== undefined && value !== null && value !== '') {
    if (label.startsWith('Dernière')) {
      display = dayjs(value).format('DD/MM/YYYY à HH:mm')
    } else {
      display = String(value)
    }
  }
  const isSignal = label.startsWith('Signal')
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: textColor }]} numberOfLines={1}>{label}</Text>
      <Text style={[styles.rowValue, { color: textColor, fontWeight: isSignal ? '600' : '500' }]} numberOfLines={1}>{display}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1 },
  header: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  symbol: { fontSize: 18, fontWeight: '600' },
  body: { padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowLabel: { fontWeight: '600', flex: 1 },
  rowValue: { fontWeight: '500', flex: 1, textAlign: 'right' },
}) 