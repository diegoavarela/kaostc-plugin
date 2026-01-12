# Layouts - React Native

Patrones de navegación y layout para apps React Native.

## Stack Navigator

```typescript
// app/navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginScreen } from '@/features/auth/screens/LoginScreen'
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen'
import type { AuthStackParamList } from './types'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}
```

## Bottom Tabs

```typescript
// app/navigation/MainNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Users, Kanban, Settings } from 'lucide-react-native'
import type { MainTabParamList } from './types'

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  const insets = useSafeAreaInsets()
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' 
            ? 'transparent' 
            : colors.background.secondary,
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <BlurView 
              intensity={80} 
              tint="dark" 
              style={StyleSheet.absoluteFill} 
            />
          ) : null,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Pipeline" 
        component={PipelineNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Kanban size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
```

## Nested Stack in Tab

```typescript
// app/navigation/ContactsNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ContactsStackParamList } from './types'

const Stack = createNativeStackNavigator<ContactsStackParamList>()

export function ContactsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="ContactsList" 
        component={ContactsScreen}
        options={{ title: 'Contactos' }}
      />
      <Stack.Screen 
        name="ContactDetail" 
        component={ContactDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen 
        name="CreateContact" 
        component={CreateContactScreen}
        options={{ 
          title: 'Nuevo Contacto',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}
```

## Modal Presentation

```typescript
// Presentar modal desde cualquier screen
import { useNavigation } from '@react-navigation/native'

function ContactsScreen() {
  const navigation = useNavigation()
  
  const openCreateModal = () => {
    navigation.navigate('CreateContact')
  }
  
  return (
    // ...
  )
}

// En el navigator - configurar modal
<Stack.Screen 
  name="CreateContact" 
  component={CreateContactScreen}
  options={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
    headerShown: true,
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <X size={24} color={colors.text.primary} />
      </TouchableOpacity>
    ),
  }}
/>

// Full screen modal
<Stack.Screen 
  name="ImageViewer" 
  component={ImageViewerScreen}
  options={{
    presentation: 'fullScreenModal',
    animation: 'fade',
    headerShown: false,
  }}
/>
```

## Screen Layout Base

```typescript
// shared/components/layout/ScreenLayout.tsx
import { View, StyleSheet, ViewProps, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/shared/theme'

interface ScreenLayoutProps extends ViewProps {
  scrollable?: boolean
  padded?: boolean
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
}

export function ScreenLayout({ 
  scrollable = false,
  padded = true,
  edges = ['bottom'],
  style,
  children,
  ...props 
}: ScreenLayoutProps) {
  const { theme } = useTheme()
  
  const content = (
    <View 
      style={[
        styles.content,
        padded && { padding: theme.spacing.screenPadding },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
  
  return (
    <SafeAreaView 
      edges={edges}
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
    >
      {scrollable ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
})
```

## Header Personalizado

```typescript
// shared/components/layout/Header.tsx
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft, MoreVertical } from 'lucide-react-native'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: () => void
}

export function Header({ title, showBack = true, rightAction }: HeaderProps) {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  
  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top + 8,
        backgroundColor: theme.colors.background.primary,
        borderBottomColor: theme.colors.border.subtle,
      }
    ]}>
      <View style={styles.left}>
        {showBack && navigation.canGoBack() && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <ChevronLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text variant="headingMedium" style={styles.title}>
        {title}
      </Text>
      
      <View style={styles.right}>
        {rightAction && (
          <TouchableOpacity onPress={rightAction} style={styles.iconButton}>
            <MoreVertical size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  left: {
    width: 48,
    alignItems: 'flex-start',
  },
  right: {
    width: 48,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 8,
  },
})
```

## List Layout

```typescript
// shared/components/layout/ListLayout.tsx
import { FlatList, FlatListProps, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, Layout } from 'react-native-reanimated'
import { useTheme } from '@/shared/theme'

interface ListLayoutProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyComponent?: React.ReactNode
  animated?: boolean
}

export function ListLayout<T extends { id: string }>({
  data,
  renderItem,
  emptyComponent,
  animated = true,
  ...props
}: ListLayoutProps<T>) {
  const { theme } = useTheme()
  
  if (!data.length && emptyComponent) {
    return <>{emptyComponent}</>
  }
  
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.content,
        { padding: theme.spacing.screenPadding },
      ]}
      ItemSeparatorComponent={() => (
        <View style={{ height: theme.spacing.itemGap }} />
      )}
      renderItem={({ item, index }) => 
        animated ? (
          <Animated.View
            entering={FadeInDown.delay(index * 50).springify()}
            layout={Layout.springify()}
          >
            {renderItem(item, index)}
          </Animated.View>
        ) : (
          renderItem(item, index)
        )
      }
      showsVerticalScrollIndicator={false}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
})
```

## Section Layout

```typescript
// shared/components/layout/Section.tsx
import { View, StyleSheet, ViewProps } from 'react-native'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'

interface SectionProps extends ViewProps {
  title?: string
  subtitle?: string
}

export function Section({ title, subtitle, children, style, ...props }: SectionProps) {
  const { theme } = useTheme()
  
  return (
    <View style={[styles.container, { marginBottom: theme.spacing.sectionGap }, style]} {...props}>
      {(title || subtitle) && (
        <View style={[styles.header, { marginBottom: theme.spacing.md }]}>
          {title && <Text variant="headingSmall">{title}</Text>}
          {subtitle && <Text variant="bodySmall" color="secondary">{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  header: {},
})
```

## Form Layout

```typescript
// shared/components/layout/FormLayout.tsx
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme } from '@/shared/theme'

interface FormLayoutProps {
  children: React.ReactNode
  footer?: React.ReactNode
}

export function FormLayout({ children, footer }: FormLayoutProps) {
  const { theme } = useTheme()
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.screenPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      
      {footer && (
        <View style={[
          styles.footer,
          { 
            padding: theme.spacing.screenPadding,
            borderTopColor: theme.colors.border.subtle,
            backgroundColor: theme.colors.background.primary,
          },
        ]}>
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  footer: {
    borderTopWidth: 1,
  },
})
```

## Drawer Navigation

```typescript
// app/navigation/DrawerNavigator.tsx
import { createDrawerNavigator } from '@react-navigation/drawer'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/ui/Text'
import { Avatar } from '@/shared/components/ui/Avatar'
import { useAuthStore } from '@/store/auth/useAuthStore'

const Drawer = createDrawerNavigator()

function CustomDrawerContent({ navigation }) {
  const { user, logout } = useAuthStore()
  const { theme } = useTheme()
  
  return (
    <View style={[styles.drawer, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.header}>
        <Avatar name={user?.name} size="lg" />
        <Text variant="headingSmall" style={styles.userName}>{user?.name}</Text>
        <Text variant="bodySmall" color="secondary">{user?.email}</Text>
      </View>
      
      <View style={styles.menu}>
        <DrawerItem 
          label="Dashboard" 
          icon={Home} 
          onPress={() => navigation.navigate('Dashboard')} 
        />
        <DrawerItem 
          label="Settings" 
          icon={Settings} 
          onPress={() => navigation.navigate('Settings')} 
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.error} />
          <Text color="error" style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Drawer.Screen name="Main" component={MainNavigator} />
    </Drawer.Navigator>
  )
}
```

## Deep Linking

```typescript
// app/navigation/linking.ts
import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

const prefix = Linking.createURL('/')

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'myapp://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Contacts: {
            screens: {
              ContactsList: 'contacts',
              ContactDetail: 'contacts/:id',
            },
          },
          Pipeline: 'pipeline',
          Settings: 'settings',
        },
      },
    },
  },
}

// Uso en NavigationContainer
<NavigationContainer linking={linking}>
  {/* navigators */}
</NavigationContainer>
```

## Checklist

- [ ] Safe area handling en todas las screens
- [ ] Keyboard avoiding en forms
- [ ] Back gesture funcionando
- [ ] Tab bar con blur (iOS)
- [ ] Deep linking configurado
- [ ] Modales presentados correctamente
- [ ] Headers consistentes
- [ ] Animaciones de transición suaves
