# React Native Clean Architecture

Arquitectura limpia para apps React Native / Expo.

## Estructura de Proyecto

```
app/
├── src/
│   ├── app/                    # Entry point y providers
│   │   ├── App.tsx
│   │   ├── Providers.tsx       # Context providers wrapper
│   │   └── navigation/
│   │       ├── RootNavigator.tsx
│   │       ├── AuthNavigator.tsx
│   │       ├── MainNavigator.tsx
│   │       └── types.ts
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── contacts/
│   │   ├── pipeline/
│   │   └── settings/
│   │
│   ├── shared/                 # Código compartido
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── ui/            # Primitivos (Button, Input, Card)
│   │   │   └── layout/        # Layout components
│   │   ├── hooks/             # Custom hooks compartidos
│   │   ├── utils/             # Utilidades
│   │   ├── constants/         # Constantes
│   │   └── types/             # Types globales
│   │
│   ├── services/              # Servicios externos
│   │   ├── api/
│   │   │   ├── client.ts      # Axios/fetch config
│   │   │   ├── endpoints.ts
│   │   │   └── types.ts
│   │   ├── storage/           # AsyncStorage wrapper
│   │   └── notifications/     # Push notifications
│   │
│   └── store/                 # Estado global
│       ├── auth/
│       ├── user/
│       └── index.ts
│
├── assets/
│   ├── images/
│   ├── fonts/
│   └── animations/            # Lottie files
│
├── app.json                   # Expo config
├── eas.json                   # EAS Build config
└── tsconfig.json
```

## Feature Module

Cada feature es autocontenida:

```typescript
// src/features/contacts/index.ts
export { ContactsScreen } from './screens/ContactsScreen'
export { ContactDetailScreen } from './screens/ContactDetailScreen'
export { useContacts } from './hooks/useContacts'
export type { Contact } from './types'
```

```
features/contacts/
├── screens/
│   ├── ContactsScreen.tsx     # Pantalla principal
│   ├── ContactDetailScreen.tsx
│   └── CreateContactScreen.tsx
├── components/
│   ├── ContactCard.tsx
│   ├── ContactList.tsx
│   └── ContactForm.tsx
├── hooks/
│   ├── useContacts.ts         # Query/mutation
│   └── useContactSearch.ts
├── services/
│   └── contactsApi.ts         # API calls
├── types.ts
└── index.ts
```

## Capas

### 1. Presentación (screens/, components/)

```typescript
// screens/ContactsScreen.tsx
import { useContacts } from '../hooks/useContacts'
import { ContactList } from '../components/ContactList'

export function ContactsScreen() {
  const { data, isLoading, error } = useContacts()
  
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!data?.length) return <EmptyState />
  
  return <ContactList contacts={data} />
}
```

### 2. Lógica (hooks/)

```typescript
// hooks/useContacts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactsApi } from '../services/contactsApi'

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.getAll,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: contactsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
```

### 3. Servicios (services/)

```typescript
// services/contactsApi.ts
import { apiClient } from '@/services/api/client'
import type { Contact, CreateContactDTO } from '../types'

export const contactsApi = {
  getAll: () => 
    apiClient.get<Contact[]>('/contacts').then(r => r.data),
    
  getById: (id: string) => 
    apiClient.get<Contact>(`/contacts/${id}`).then(r => r.data),
    
  create: (data: CreateContactDTO) =>
    apiClient.post<Contact>('/contacts', data).then(r => r.data),
    
  update: (id: string, data: Partial<Contact>) =>
    apiClient.patch<Contact>(`/contacts/${id}`, data).then(r => r.data),
    
  delete: (id: string) =>
    apiClient.delete(`/contacts/${id}`),
}
```

## Navegación

```typescript
// app/navigation/types.ts
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
}

export type MainTabParamList = {
  Home: undefined
  Contacts: undefined
  Pipeline: undefined
  Settings: undefined
}

export type ContactsStackParamList = {
  ContactsList: undefined
  ContactDetail: { id: string }
  CreateContact: undefined
}
```

```typescript
// app/navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '@/features/auth/hooks/useAuth'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <SplashScreen />
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## Estado Global

Preferir React Query para server state. Zustand para client state:

```typescript
// store/auth/useAuthStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

## API Client

```typescript
// services/api/client.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { API_URL } from '@/shared/constants'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
```

## Providers Setup

```typescript
// app/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@/shared/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
```

## Reglas

1. **Features son independientes** - Cada feature puede importar de shared/ pero no de otras features
2. **Screens solo orquestan** - Lógica en hooks, UI en components
3. **Server state en React Query** - Nunca duplicar en estado local
4. **Client state en Zustand** - Solo para estado UI o auth
5. **Types colocados** - Cada feature tiene sus propios types
6. **Index exports** - Cada carpeta expone su API pública

## Anti-patrones

```typescript
// ❌ MAL - lógica en screen
function ContactsScreen() {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    fetch('/contacts').then(r => r.json()).then(setContacts)
  }, [])
}

// ✅ BIEN - lógica en hook
function ContactsScreen() {
  const { data: contacts } = useContacts()
}

// ❌ MAL - importar de otra feature
import { useUser } from '@/features/settings/hooks/useUser'

// ✅ BIEN - compartir via shared/ o store/
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
```

## Testing

```typescript
// features/contacts/__tests__/useContacts.test.ts
import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useContacts } from '../hooks/useContacts'

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('useContacts', () => {
  it('fetches contacts', async () => {
    const { result } = renderHook(() => useContacts(), { wrapper })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(3)
  })
})
```
