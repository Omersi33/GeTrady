import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

type Variant = 'indigo' | 'emerald' | 'red';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}

const COLORS: Record<Variant, string> = {
  indigo : '#1e40af',
  emerald: '#047857',
  red    : '#dc2626',
};

export default function FilledButton({
  label,
  onPress,
  disabled = false,
  variant = 'indigo',
  style:extraStyle = {},
}: Props) {
  return (
    <Pressable
      android_ripple={{ color: '#000', radius: 200, foreground: true }}
      style={({ pressed }) => [
        styles.btn,
        extraStyle,
        {
          backgroundColor: COLORS[variant],
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  txt: {
    color: 'white',
    fontSize: 16,
    // fontWeight: '600', // On retire la graisse pour tester
    textAlign: 'center',
  },
});
