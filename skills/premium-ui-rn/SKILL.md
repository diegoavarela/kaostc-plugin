# Premium UI - React Native

UI de alta calidad para React Native. Nada de apps genéricas.

## Principios

1. **Nativo primero** - Usar componentes nativos, no emular web
2. **60 FPS** - Animaciones fluidas, sin jank
3. **Feedback táctil** - Respuesta inmediata a toques
4. **Densidad correcta** - Espaciado generoso en mobile

## Sistema de Colores

```typescript
// shared/theme/colors.ts
export const colors = {
  // Fondos
  background: {
    primary: '#0A0A0B',      // Fondo principal
    secondary: '#141416',    // Cards, modals
    tertiary: '#1C1C1F',     // Inputs, elevated
  },
  
  // Superficies
  surface: {
    default: '#1C1C1F',
    elevated: '#242428',
    overlay: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Texto
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
    inverse: '#0A0A0B',
  },
  
  // Accent
  accent: {
    primary: '#6366F1',      // Indigo
    secondary: '#8B5CF6',    // Violet
    gradient: ['#6366F1', '#8B5CF6'],
  },
  
  // Semánticos
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Bordes
  border: {
    default: '#27272A',
    subtle: '#1C1C1F',
    focus: '#6366F1',
  },
}
```

## Blur y Glassmorphism

```typescript
// shared/components/ui/GlassCard.tsx
import { BlurView } from 'expo-blur'
import { StyleSheet, View, ViewProps } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

interface GlassCardProps extends ViewProps {
  intensity?: number
  children: React.ReactNode
}

export function GlassCard({ 
  intensity = 20, 
  children, 
  style,
  ...props 
}: GlassCardProps) {
  return (
    <Animated.View entering={FadeIn} style={[styles.container, style]} {...props}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {children}
      </View>
      {/* Borde sutil */}
      <View style={styles.border} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
})
```

## Gradientes

```typescript
// shared/components/ui/GradientButton.tsx
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, Text, StyleSheet } from 'react-native'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { colors } from '@/shared/theme/colors'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface GradientButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
}

export function GradientButton({ title, onPress, disabled }: GradientButtonProps) {
  const scale = useSharedValue(1)
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }
  
  const handlePressOut = () => {
    scale.value = withSpring(1)
  }
  
  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle, disabled && styles.disabled]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <LinearGradient
        colors={colors.accent.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
})
```

## Animaciones

### Entrada de elementos

```typescript
// shared/components/AnimatedList.tsx
import Animated, { 
  FadeInDown, 
  FadeInUp,
  Layout,
  SlideInRight,
} from 'react-native-reanimated'

// Entrada escalonada
export function AnimatedListItem({ 
  index, 
  children 
}: { 
  index: number
  children: React.ReactNode 
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
    >
      {children}
    </Animated.View>
  )
}

// Uso
function ContactList({ contacts }) {
  return (
    <FlatList
      data={contacts}
      renderItem={({ item, index }) => (
        <AnimatedListItem index={index}>
          <ContactCard contact={item} />
        </AnimatedListItem>
      )}
    />
  )
}
```

### Gesture-based animations

```typescript
// shared/components/SwipeableCard.tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

const SWIPE_THRESHOLD = 100

export function SwipeableCard({ onDelete, children }) {
  const translateX = useSharedValue(0)
  
  const triggerHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  }
  
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = Math.max(-150, e.translationX)
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(triggerHaptic)()
        runOnJS(onDelete)()
      }
      translateX.value = withSpring(0)
    })
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
```

## Sombras

```typescript
// shared/theme/shadows.ts
import { Platform } from 'react-native'

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
  
  // Glow para elementos destacados
  glow: (color: string) => Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
  }),
}
```

## Inputs Premium

```typescript
// shared/components/ui/PremiumInput.tsx
import { useState } from 'react'
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet,
  TextInputProps,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'
import { colors } from '@/shared/theme/colors'

interface PremiumInputProps extends TextInputProps {
  label: string
  error?: string
}

export function PremiumInput({ label, error, ...props }: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  
  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(
      error ? colors.error : 
      isFocused ? colors.accent.primary : 
      colors.border.default
    ),
  }))
  
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  container: {
    backgroundColor: colors.surface.default,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    color: colors.text.primary,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
})
```

## Loading States

```typescript
// shared/components/ui/Skeleton.tsx
import { useEffect } from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

interface SkeletonProps extends ViewProps {
  width?: number | string
  height?: number
  borderRadius?: number
}

export function Skeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const translateX = useSharedValue(-100)
  
  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, { duration: 1000 }),
      -1,
      false
    )
  }, [])
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }))
  
  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.default,
    overflow: 'hidden',
  },
})
```

## Bottom Sheet

```typescript
// shared/components/ui/BottomSheet.tsx
import { forwardRef, useCallback } from 'react'
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { colors } from '@/shared/theme/colors'

interface BottomSheetProps {
  children: React.ReactNode
  snapPoints?: string[]
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, snapPoints = ['50%', '90%'] }, ref) => {
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.7}
        />
      ),
      []
    )

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.background.secondary,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.text.tertiary,
          width: 40,
        }}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)
```

## Anti-patrones

```typescript
// ❌ MAL - Sin feedback táctil
<TouchableOpacity onPress={onPress}>

// ✅ BIEN - Con haptic feedback
<Pressable 
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }}
>

// ❌ MAL - Animaciones en JS thread
<Animated.View style={{ opacity: fadeAnim }}>

// ✅ BIEN - Animaciones en UI thread (Reanimated)
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible ? 1 : 0)
}))

// ❌ MAL - Colores hardcoded
<View style={{ backgroundColor: '#1a1a1a' }}>

// ✅ BIEN - Desde theme
<View style={{ backgroundColor: colors.background.primary }}>

// ❌ MAL - Sombras solo iOS
shadowColor: '#000'
shadowOffset: { width: 0, height: 2 }

// ✅ BIEN - Platform-aware
style={shadows.md}
```

## Checklist

- [ ] Colores desde theme, nunca hardcoded
- [ ] Haptic feedback en interacciones
- [ ] Animaciones con Reanimated (UI thread)
- [ ] Sombras con Platform.select
- [ ] Loading states con skeletons
- [ ] Error states claros
- [ ] Dark mode por defecto
- [ ] Spacing consistente (múltiplos de 4)
