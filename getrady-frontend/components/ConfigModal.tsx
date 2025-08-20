import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import InputRow from '@/components/InputRow';
import FilledButton from '@/components/FilledButton';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface Cfg {
  maFast: number;
  maSlow: number;
  rsiLo: number;
  rsiHi: number;
  bbPeriod: number;
  bbStdDev: number;
}

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (cfg: Cfg) => void;
  initial?: Cfg;
}

export default function ConfigModal({ visible, onCancel, onSubmit, initial }: Props) {
  const [maFast, setMaFast] = useState('5');
  const [maSlow, setMaSlow] = useState('20');
  const [rsiLo, setRsiLo]   = useState('30');
  const [rsiHi, setRsiHi]   = useState('70');
  const [bbPeriod, setBbPeriod] = useState('20');
  const [bbStdDev, setBbStdDev] = useState('2');

  // sync initial values only when modal becomes visible
  const prevVisible = React.useRef(false);
  React.useEffect(() => {
    if (visible && !prevVisible.current) {
      if (initial) {
        setMaFast(initial.maFast !== undefined ? String(initial.maFast) : '5');
        setMaSlow(initial.maSlow !== undefined ? String(initial.maSlow) : '20');
        setRsiLo(initial.rsiLo   !== undefined ? String(initial.rsiLo)   : '30');
        setRsiHi(initial.rsiHi   !== undefined ? String(initial.rsiHi)   : '70');
        setBbPeriod(initial.bbPeriod !== undefined ? String(initial.bbPeriod) : '20');
        setBbStdDev(initial.bbStdDev !== undefined ? String(initial.bbStdDev) : '2');
      }
    }
    prevVisible.current = visible;
  }, [visible]);

  const theme = useColorScheme() ?? 'light';

  function submit() {
    onSubmit({ maFast: +maFast, maSlow: +maSlow, rsiLo: +rsiLo, rsiHi: +rsiHi, bbPeriod: +bbPeriod, bbStdDev: +bbStdDev });
    // reset after submit
    setMaFast('5'); setMaSlow('20'); setRsiLo('30'); setRsiHi('70');
    setBbPeriod('20'); setBbStdDev('2');
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' }}>
        <View style={{ backgroundColor: Colors[theme].background, padding:20, borderRadius:8, width:'80%' }}>
          <Text style={{ fontWeight:'600', marginBottom:4, color:Colors[theme].text }}>maFast</Text>
          <InputRow icon="trending-up" placeholder="5" value={maFast} onChange={setMaFast} keyboardType="numeric" />
          <Text style={{ fontWeight:'600', marginBottom:4, color:Colors[theme].text }}>maSlow</Text>
          <InputRow icon="trending-up" placeholder="20" value={maSlow} onChange={setMaSlow} keyboardType="numeric" />
          <Text style={{ fontWeight:'600', marginBottom:4, color:Colors[theme].text }}>rsiLo</Text>
          <InputRow icon="activity" placeholder="30" value={rsiLo} onChange={setRsiLo} keyboardType="numeric" />
          <Text style={{ fontWeight:'600', marginBottom:4, color:Colors[theme].text }}>rsiHi</Text>
          <InputRow icon="activity" placeholder="70" value={rsiHi} onChange={setRsiHi} keyboardType="numeric" />
          <Text style={{ fontWeight:'600', marginBottom:4, color:Colors[theme].text }}>bbPeriod</Text>
          <InputRow icon="activity" placeholder="20" value={bbPeriod} onChange={setBbPeriod} keyboardType="numeric" />
          <Text style={{ fontWeight:'600', marginBottom:4, color:Colors[theme].text }}>bbStdDev</Text>
          <InputRow icon="activity" placeholder="2" value={bbStdDev} onChange={setBbStdDev} keyboardType="numeric" allowDecimal />
          <View style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:12 }}>
            <FilledButton label="Annuler" variant="red" onPress={onCancel} style={{ flex:1 }} />
            <View style={{ width:8 }} />
            <FilledButton label="Valider" variant="emerald" onPress={submit} style={{ flex:1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
} 