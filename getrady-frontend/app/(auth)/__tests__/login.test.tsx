import React from 'react';
import renderer, { act } from 'react-test-renderer';
import LoginScreen from '../login';

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
  return {
    __esModule: true,
    default: (props: any) => React.createElement('InputRowMock', props, null),
  };
});

jest.mock('@/components/FilledButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => React.createElement('BtnMock', props, null),
  };
});

jest.mock('@/context/AuthContext', () => {
  const login = jest.fn();
  return { __esModule: true, useAuth: () => ({ login }), __loginMock: login };
});

jest.mock('@/utils/hash', () => ({ sha1: async (s: string) => 'HASHED-' + s }));

jest.mock('expo-router', () => {
  const replace = jest.fn();
  return {
    __esModule: true,
    Link: (p: any) => p.children,
    router: { replace },
    __replaceMock: replace,
  };
});

describe('LoginScreen', () => {
  it('envoie email + hash et redirige en cas de succès', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(<LoginScreen />);
    });

    const inputs = tree.root.findAll((n: any) => (n.type as any) === 'InputRowMock');
    expect(inputs).toHaveLength(2);

    await act(async () => {
      (inputs[0].props.onChange as Function)('user@mail.local');
      (inputs[1].props.onChange as Function)('secret123');
    });
    
    const btn = tree.root.findByProps({ label: 'Se connecter' });

    await act(async () => {
      await btn.props.onPress();
    });

    const { __loginMock } = require('@/context/AuthContext') as any;
    const { __replaceMock } = require('expo-router') as any;

    expect(__loginMock).toHaveBeenCalledWith({
      email: 'user@mail.local',
      password: 'HASHED-secret123',
    });
    expect(__replaceMock).toHaveBeenCalledWith('/');
  });
});