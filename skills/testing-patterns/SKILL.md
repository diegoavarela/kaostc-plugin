# Testing Patterns

Reglas para escribir tests efectivos y mantenibles.

## Principios

1. **Testear comportamiento, no implementación**
2. **Un concepto por test**
3. **Tests como documentación**
4. **Independientes entre sí**

## Estructura AAA

```typescript
it('should create user with valid data', async () => {
  // Arrange - preparar datos y mocks
  const userData = { email: 'test@example.com', name: 'Test' };
  
  // Act - ejecutar la acción
  const user = await createUser(userData);
  
  // Assert - verificar resultado
  expect(user.email).toBe('test@example.com');
  expect(user.id).toBeDefined();
});
```

## Naming

```typescript
// ✅ CORRECTO - Describe comportamiento
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid email', () => {});
    it('should throw ValidationError when email is invalid', () => {});
    it('should throw DuplicateError when email exists', () => {});
  });
});

// ❌ INCORRECTO - No describe nada
it('test1', () => {});
it('works', () => {});
it('createUser', () => {});
```

## Qué testear

### Sí testear
- Lógica de negocio
- Transformaciones de datos
- Casos edge
- Errores esperados
- Integraciones críticas

### No testear
- Getters/setters triviales
- Código de frameworks
- Tipos de TypeScript
- CSS/estilos

## Unit Tests

```typescript
// Función pura - fácil de testear
function calculateDiscount(price: number, percentage: number): number {
  return price * (1 - percentage / 100);
}

it('should calculate 20% discount', () => {
  expect(calculateDiscount(100, 20)).toBe(80);
});

it('should return original price for 0% discount', () => {
  expect(calculateDiscount(100, 0)).toBe(100);
});

it('should handle decimal percentages', () => {
  expect(calculateDiscount(100, 15.5)).toBe(84.5);
});
```

## Mocking

```typescript
// ✅ CORRECTO - Mock de dependencias externas
const mockDb = {
  users: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

it('should return user when found', async () => {
  mockDb.users.findUnique.mockResolvedValue({ id: '1', name: 'Test' });
  
  const user = await getUser('1');
  
  expect(user.name).toBe('Test');
  expect(mockDb.users.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
});

// ❌ INCORRECTO - Over-mocking
// No mockear lo que estás testeando
// No mockear utils internos triviales
```

## Integration Tests

```typescript
// Testear flujo completo con DB real (test DB)
describe('User API Integration', () => {
  beforeAll(async () => {
    await db.migrate();
  });
  
  afterEach(async () => {
    await db.users.deleteMany();
  });
  
  it('should create and retrieve user', async () => {
    // Create
    const created = await api.post('/users', { email: 'test@example.com' });
    expect(created.status).toBe(201);
    
    // Retrieve
    const fetched = await api.get(`/users/${created.data.id}`);
    expect(fetched.data.email).toBe('test@example.com');
  });
});
```

## Testing Async

```typescript
// ✅ CORRECTO - Usar async/await
it('should fetch user', async () => {
  const user = await fetchUser('1');
  expect(user).toBeDefined();
});

// ✅ CORRECTO - Testear errores async
it('should throw on invalid id', async () => {
  await expect(fetchUser('invalid')).rejects.toThrow(NotFoundError);
});

// ❌ INCORRECTO - Olvidar await
it('should fetch user', () => {
  const user = fetchUser('1');  // Promise, no resultado
  expect(user).toBeDefined();   // Siempre pasa (Promise es truthy)
});
```

## Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should show error message on invalid submit', async () => {
  render(<LoginForm />);
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});

it('should call onSubmit with form data', async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' }});
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' }});
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
});
```

## Test Coverage

- Apuntar a 80%+ en lógica de negocio
- No obsesionarse con 100%
- Coverage no garantiza calidad
- Priorizar tests útiles sobre coverage

## CI Integration

```yaml
# Los tests DEBEN pasar en CI antes de merge
test:
  runs-on: ubuntu-latest
  steps:
    - run: pnpm test
    - run: pnpm run test:coverage
    # Fallar si coverage baja del umbral
```

## Review Agent verifica:

- [ ] Features nuevas tienen tests
- [ ] Tests describen comportamiento
- [ ] Casos edge cubiertos
- [ ] Errores testeados
- [ ] No hay tests que siempre pasan
- [ ] Mocks apropiados (no over-mocking)
