import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('@/components/useColorScheme', () => ({ useColorScheme: () => 'light' }));
jest.mock('@/constants/Colors', () => ({
  __esModule: true,
  default: {
    light: { background: '#fff', text: '#000', tint: '#1e40af', tabIconDefault: '#666', tabIconSelected: '#fff' },
    dark:  { background: '#000', text: '#fff', tint: '#60a5fa', tabIconDefault: '#999', tabIconSelected: '#fff' },
  },
}));

jest.mock('@expo/vector-icons/Feather', () => {
  const React = require('react');
  return { __esModule: true, default: (p: any) => React.createElement('Feather', p, null) };
});

jest.mock('@/context/AuthContext', () => ({
  __esModule: true,
  useAuth: () => ({ user: { isAdmin: true } }),
}));

jest.mock('@/services/AssetService', () => {
  const del = jest.fn();
  const upd = jest.fn();
  return {
    __esModule: true,
    AssetService: { delete: (...a: any[]) => del(...a), updateCfg: (...a: any[]) => upd(...a) },
    __deleteMock: del,
    __updateMock: upd,
  };
});

const asset = {
  id: 1,
  symbol: 'BTC',
  lastUpdate: new Date().toISOString(),
  currentValue: 67000,
  advice: 'HOLD',
  TP1: 68000,
  TP2: 69000,
  TP3: 70000,
  SL: 65000,
  maFast: 5,
  maSlow: 20,
  rsiLo: 30,
  rsiHi: 70,
  bbPeriod: 20,
  bbStdDev: 2,
} as any;

describe('AssetCard', () => {
  it('toggle l’extension et affiche les icônes admin', async () => {
    const { AssetCard } = require('../AssetCard');

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<AssetCard asset={asset} onDeleted={() => {}} />);
    });

    expect(tree.root.findAllByProps({ name: 'chevron-down' }).length).toBeGreaterThan(0);

    const header = tree.root.findAll((n) => typeof n.props?.onPress === 'function')[0];
    await act(async () => {
      header.props.onPress();
    });

    expect(tree.root.findAllByProps({ name: 'chevron-up' }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ name: 'edit' }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ name: 'trash-2' }).length).toBeGreaterThan(0);
  });

  it('supprime après confirmation et appelle onDeleted', async () => {
    const { AssetCard } = require('../AssetCard');
    const onDeleted = jest.fn();

    const rn = require('react-native');
    const spy = jest.spyOn(rn.Alert, 'alert' as any).mockImplementation((...args: any[]) => {
      const btns = args[2] as any[];
      const destructive = btns?.find((b: any) => b.style === 'destructive');
      destructive?.onPress?.();
    });

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<AssetCard asset={asset} onDeleted={onDeleted} />);
    });

    const trashIcon = tree.root.findAllByProps({ name: 'trash-2' })[0];
    let pressable: any = trashIcon;
    while (pressable && typeof pressable.props?.onPress !== 'function') {
      pressable = pressable.parent;
    }
    if (!pressable) throw new Error('Could not find pressable ancestor for trash icon');

    await act(async () => {
      await pressable.props.onPress();
    });

    const { __deleteMock } = require('@/services/AssetService') as any;
    expect(__deleteMock).toHaveBeenCalledWith(asset.id);
    expect(onDeleted).toHaveBeenCalledWith(asset.id);

    spy.mockRestore();
  });
});