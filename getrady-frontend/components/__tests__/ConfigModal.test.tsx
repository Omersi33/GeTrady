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
jest.mock('@/components/InputRow', () => {
  const React = require('react');
  return { __esModule: true, default: (p: any) => React.createElement('InputRowMock', p, null) };
});
jest.mock('@/components/FilledButton', () => {
  const React = require('react');
  return { __esModule: true, default: (p: any) => React.createElement('BtnMock', p, null) };
});

describe('ConfigModal', () => {
  it('préremplit avec initial et soumet des nombres', async () => {
    const initial = { maFast: 9, maSlow: 26, rsiLo: 20, rsiHi: 80, bbPeriod: 21, bbStdDev: 2.5 };
    const onSubmit = jest.fn();

    const Comp = require('../ConfigModal').default;
    let tree: any;
    await act(async () => {
      tree = renderer.create(<Comp visible={false} onCancel={() => {}} onSubmit={onSubmit} initial={initial} />);
    });

    await act(async () => {
      tree.update(<Comp visible={true} onCancel={() => {}} onSubmit={onSubmit} initial={initial} />);
    });

    const inputs = tree.root.findAll((n: any) => (n.type as any) === 'InputRowMock');
    expect(inputs[0].props.value).toBe(String(initial.maFast));
    expect(inputs[1].props.value).toBe(String(initial.maSlow));
    expect(inputs[2].props.value).toBe(String(initial.rsiLo));
    expect(inputs[3].props.value).toBe(String(initial.rsiHi));
    expect(inputs[4].props.value).toBe(String(initial.bbPeriod));
    expect(inputs[5].props.value).toBe(String(initial.bbStdDev));

    const submit = tree.root.findByProps({ label: 'Valider' });
    await act(async () => {
      await submit.props.onPress();
    });

    expect(onSubmit).toHaveBeenCalledWith({
      maFast: 9,
      maSlow: 26,
      rsiLo: 20,
      rsiHi: 80,
      bbPeriod: 21,
      bbStdDev: 2.5,
    });
  });
});