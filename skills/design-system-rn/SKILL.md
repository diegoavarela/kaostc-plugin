# Design System - React Native

Sistema de diseño consistente para apps React Native.

## Estructura

```
src/shared/theme/
├── colors.ts          # Paleta de colores
├── typography.ts      # Fuentes y escalas
├── spacing.ts         # Sistema de espaciado
├── shadows.ts         # Sombras por plataforma
├── radius.ts          # Border radius
├── index.ts           # Export todo
└── ThemeProvider.tsx  # Context provider
```

## Colores

```typescript
// shared/theme/colors.ts
export const palette = {
  // Neutrals
  gray: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },
  
  // Primary
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // Semantic
  green: {
    500: '#22C55E',
    600: '#16A34A',
  },
  red: {
    500: '#EF4444',
    600: '#DC2626',
  },
  amber: {
    500: '#F59E0B',
    600: '#D97706',
  },
  blue: {
    500: '#3B82F6',
    600: '#2563EB',
  },
}

// Semantic tokens
export const colors = {
  // Dark theme (default)
  dark: {
    background: {
      primary: palette.gray[950],
      secondary: palette.gray[900],
      tertiary: palette.gray[800],
    },
    surface: {
      default: palette.gray[800],
      elevated: palette.gray[700],
      overlay: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: palette.gray[400],
      tertiary: palette.gray[500],
    },
    border: {
      default: palette.gray[800],
      subtle: palette.gray[900],
      focus: palette.indigo[500],
    },
    accent: {
      primary: palette.indigo[500],
      secondary: palette.indigo[400],
    },
    success: palette.green[500],
    error: palette.red[500],
    warning: palette.amber[500],
    info: palette.blue[500],
  },
  
  // Light theme
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: palette.gray[50],
      tertiary: palette.gray[100],
    },
    surface: {
      default: '#FFFFFF',
      elevated: palette.gray[50],
      overlay: 'rgba(0, 0, 0, 0.05)',
    },
    text: {
      primary: palette.gray[900],
      secondary: palette.gray[600],
      tertiary: palette.gray[500],
    },
    border: {
      default: palette.gray[200],
      subtle: palette.gray[100],
      focus: palette.indigo[500],
    },
    accent: {
      primary: palette.indigo[600],
      secondary: palette.indigo[500],
    },
    success: palette.green[600],
    error: palette.red[600],
    warning: palette.amber[600],
    info: palette.blue[600],
  },
}
```

## Typography

```typescript
// shared/theme/typography.ts
import { Platform } from 'react-native'

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
})

export const typography = {
  // Display
  displayLarge: {
    fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  
  // Headings
  headingLarge: {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  headingMedium: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  headingSmall: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  
  // Body
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  
  // Labels
  labelLarge: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontFamily,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
}
```

## Spacing

```typescript
// shared/theme/spacing.ts
export const spacing = {
  // Base unit: 4px
  xxs: 2,   // 2
  xs: 4,    // 4
  sm: 8,    // 8
  md: 12,   // 12
  lg: 16,   // 16
  xl: 24,   // 24
  xxl: 32,  // 32
  xxxl: 48, // 48
  
  // Semantic
  screenPadding: 16,
  cardPadding: 16,
  inputPadding: 14,
  buttonPadding: 16,
  listItemPadding: 12,
  sectionGap: 24,
  itemGap: 12,
}
```

## Border Radius

```typescript
// shared/theme/radius.ts
export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
  
  // Semantic
  button: 12,
  card: 16,
  input: 12,
  avatar: 9999,
  badge: 6,
  bottomSheet: 24,
}
```

## Shadows

```typescript
// shared/theme/shadows.ts
import { Platform, ViewStyle } from 'react-native'

type ShadowStyle = Pick<ViewStyle, 
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>

const createShadow = (
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
): ShadowStyle => Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
  },
  android: {
    elevation,
  },
})!

export const shadows = {
  none: createShadow(0, 0, 0, 0),
  xs: createShadow(1, 0.1, 2, 1),
  sm: createShadow(2, 0.15, 4, 2),
  md: createShadow(4, 0.2, 8, 4),
  lg: createShadow(8, 0.25, 16, 8),
  xl: createShadow(12, 0.3, 24, 12),
}
```

## Theme Provider

```typescript
// shared/theme/ThemeProvider.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { colors as themeColors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'
import { radius } from './radius'
import { shadows } from './shadows'

type ThemeMode = 'light' | 'dark' | 'system'

interface Theme {
  colors: typeof themeColors.dark
  typography: typeof typography
  spacing: typeof spacing
  radius: typeof radius
  shadows: typeof shadows
  isDark: boolean
}

interface ThemeContextType {
  theme: Theme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [mode, setMode] = useState<ThemeMode>('system')
  
  const isDark = mode === 'system' 
    ? systemColorScheme === 'dark' 
    : mode === 'dark'
  
  const theme: Theme = {
    colors: isDark ? themeColors.dark : themeColors.light,
    typography,
    spacing,
    radius,
    shadows,
    isDark,
  }
  
  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## Uso en Componentes

```typescript
// shared/components/ui/Card.tsx
import { View, StyleSheet, ViewProps } from 'react-native'
import { useTheme } from '@/shared/theme'

interface CardProps extends ViewProps {
  elevated?: boolean
}

export function Card({ elevated, style, children, ...props }: CardProps) {
  const { theme } = useTheme()
  
  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface.default,
          borderRadius: theme.radius.card,
          padding: theme.spacing.cardPadding,
        },
        elevated && theme.shadows.md,
        style,
      ]} 
      {...props}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
})
```

```typescript
// shared/components/ui/Text.tsx
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import { useTheme } from '@/shared/theme'

type Variant = keyof typeof typography

interface TextProps extends RNTextProps {
  variant?: Variant
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success'
}

export function Text({ 
  variant = 'bodyMedium', 
  color = 'primary',
  style, 
  ...props 
}: TextProps) {
  const { theme } = useTheme()
  
  const textColor = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    tertiary: theme.colors.text.tertiary,
    error: theme.colors.error,
    success: theme.colors.success,
  }[color]
  
  return (
    <RNText 
      style={[
        theme.typography[variant],
        { color: textColor },
        style,
      ]} 
      {...props} 
    />
  )
}
```

## Styled Components Helper

```typescript
// shared/theme/styled.ts
import { useTheme } from './ThemeProvider'
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

export function useStyles<T extends NamedStyles<T>>(
  styleFactory: (theme: ReturnType<typeof useTheme>['theme']) => T
): T {
  const { theme } = useTheme()
  return StyleSheet.create(styleFactory(theme)) as T
}

// Uso:
function MyComponent() {
  const styles = useStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
    },
    title: {
      ...theme.typography.headingLarge,
      color: theme.colors.text.primary,
    },
  }))
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  )
}
```

## Component Tokens

```typescript
// shared/theme/components.ts
import { colors } from './colors'
import { spacing } from './spacing'
import { radius } from './radius'
import { typography } from './typography'

export const componentTokens = {
  button: {
    sizes: {
      sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        ...typography.labelMedium,
        borderRadius: radius.sm,
      },
      md: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        ...typography.labelLarge,
        borderRadius: radius.md,
      },
      lg: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        ...typography.bodyLarge,
        fontWeight: '600',
        borderRadius: radius.lg,
      },
    },
    variants: {
      primary: (isDark: boolean) => ({
        backgroundColor: colors[isDark ? 'dark' : 'light'].accent.primary,
        color: '#FFFFFF',
      }),
      secondary: (isDark: boolean) => ({
        backgroundColor: colors[isDark ? 'dark' : 'light'].surface.default,
        color: colors[isDark ? 'dark' : 'light'].text.primary,
      }),
      ghost: (isDark: boolean) => ({
        backgroundColor: 'transparent',
        color: colors[isDark ? 'dark' : 'light'].accent.primary,
      }),
    },
  },
  
  input: {
    sizes: {
      sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        ...typography.bodySmall,
        borderRadius: radius.sm,
      },
      md: {
        paddingVertical: spacing.inputPadding,
        paddingHorizontal: spacing.lg,
        ...typography.bodyMedium,
        borderRadius: radius.input,
      },
      lg: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        ...typography.bodyLarge,
        borderRadius: radius.lg,
      },
    },
  },
  
  avatar: {
    sizes: {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 56,
      xl: 72,
    },
  },
  
  badge: {
    sizes: {
      sm: {
        paddingVertical: 2,
        paddingHorizontal: spacing.xs,
        ...typography.labelSmall,
      },
      md: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        ...typography.labelMedium,
      },
    },
  },
}
```

## Checklist

- [ ] Colores semánticos (no palette directa en componentes)
- [ ] Typography scale consistente
- [ ] Spacing múltiplos de 4
- [ ] Shadows platform-aware
- [ ] Dark/Light mode soportado
- [ ] ThemeProvider en root
- [ ] useTheme hook en componentes
- [ ] Component tokens para consistencia
