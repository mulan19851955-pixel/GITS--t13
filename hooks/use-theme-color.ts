/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

const Colors = {
  light: {
    background: '#ffffff',
    text: '#000000',
    tint: '#007AFF',
    tabIconDefault: '#ccc',
    tabIconSelected: '#007AFF',
    // Добавь сюда все свои цвета для светлой темы
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    tint: '#0A84FF',
    tabIconDefault: '#666',
    tabIconSelected: '#0A84FF',
    // Добавь сюда все свои цвета для тёмной темы
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export { Colors };
