# Error Handling

Reglas para manejo consistente de errores en todo el proyecto.

## Principios

1. **Errores explícitos** - Nunca silenciar errores
2. **Fail fast** - Fallar temprano, fallar claro
3. **Errores tipados** - Usar tipos custom, no strings
4. **Contexto útil** - El error debe decir qué pasó y dónde

## Custom Errors

Siempre definir errores propios del dominio:

```typescript
// ✅ CORRECTO
class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found: ${userId}`);
    this.name = 'UserNotFoundError';
  }
}

class ValidationError extends Error {
  constructor(field: string, reason: string) {
    super(`Validation failed for ${field}: ${reason}`);
    this.name = 'ValidationError';
  }
}

// ❌ INCORRECTO
throw new Error("not found");
throw "something went wrong";
```

```swift
// ✅ CORRECTO (Swift)
enum AppError: Error {
    case userNotFound(id: String)
    case validationFailed(field: String, reason: String)
    case networkError(underlying: Error)
}

// ❌ INCORRECTO
throw NSError(domain: "", code: 0)
```

## Try/Catch

```typescript
// ✅ CORRECTO - Catch específico
try {
  await createUser(data);
} catch (error) {
  if (error instanceof ValidationError) {
    return { error: error.message, status: 400 };
  }
  if (error instanceof DuplicateEmailError) {
    return { error: 'Email already exists', status: 409 };
  }
  // Re-throw errores inesperados
  throw error;
}

// ❌ INCORRECTO - Catch genérico silencioso
try {
  await createUser(data);
} catch (e) {
  console.log(e);
  return null;
}
```

## Result Pattern (alternativa a exceptions)

```typescript
// Para operaciones que pueden fallar esperadamente
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function parseEmail(input: string): Result<Email, ValidationError> {
  if (!input.includes('@')) {
    return { success: false, error: new ValidationError('email', 'Invalid format') };
  }
  return { success: true, data: input as Email };
}

// Uso
const result = parseEmail(input);
if (!result.success) {
  // Handle error
  return;
}
// Use result.data
```

## Async/Await

```typescript
// ✅ CORRECTO - Siempre manejar errores async
async function fetchUser(id: string) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new UserNotFoundError(id);
    }
    throw new NetworkError('Failed to fetch user', error);
  }
}

// ❌ INCORRECTO - Promise sin catch
api.get(`/users/${id}`).then(r => setUser(r.data));
```

## Logging de Errores

```typescript
// ✅ CORRECTO - Log con contexto
catch (error) {
  logger.error('Failed to process payment', {
    userId: user.id,
    amount: payment.amount,
    error: error.message,
    stack: error.stack,
  });
  throw error;
}

// ❌ INCORRECTO - Solo console.log
catch (error) {
  console.log(error);
}
```

## UI Error States

Siempre mostrar estados de error al usuario:

```typescript
// ✅ CORRECTO
if (error) {
  return <ErrorMessage message={error.message} retry={refetch} />;
}

// ❌ INCORRECTO - UI en blanco si hay error
if (error) {
  return null;
}
```

## Reglas para Review Agent

El review RECHAZA si:
- [ ] Hay `catch` vacío o solo con `console.log`
- [ ] Se usa `any` en catch sin re-throw
- [ ] Errores como strings en vez de Error objects
- [ ] Async sin manejo de error
- [ ] UI sin estado de error
