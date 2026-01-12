# Next.js Clean Architecture Patterns

Basado en: github.com/nikolovlazar/nextjs-clean-architecture

## Principio Core

Clean Architecture = **separación de concerns** mediante capas. Cada capa depende solo de las capas **debajo** de ella.

Objetivos:
- **Independiente de UI**: lógica de negocio no acoplada a Next.js
- **Independiente de DB**: operaciones aisladas en su capa
- **Independiente de Frameworks**: business rules en plain JavaScript
- **Testeable**: lógica testeable sin UI, DB, ni servidor

## Arquitectura de 5 Capas

```
┌─────────────────────────────────────────┐
│     FRAMEWORKS & DRIVERS (Next.js)      │
│  Pages, Components, Server Actions,      │
│  Route Handlers, Middleware              │
└──────────────────┬──────────────────────┘
                   │ usa Controllers
┌──────────────────▼──────────────────────┐
│         INTERFACE ADAPTERS              │
│  Controllers (auth + validation)         │
│  Presenters (data → UI format)           │
└──────────────────┬──────────────────────┘
                   │ orquesta Use Cases
┌──────────────────▼──────────────────────┐
│            APPLICATION                   │
│  Use Cases (business logic)              │
│  Interfaces de Repos y Services          │
└──────────────────┬──────────────────────┘
                   │ usa Repositories
┌──────────────────▼──────────────────────┐
│             ENTITIES                     │
│  Models (data shapes)                    │
│  Errors (custom errors)                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           INFRASTRUCTURE                 │
│  Repository Implementations (Drizzle)    │
│  Service Implementations (Auth, Email)   │
└─────────────────────────────────────────┘
```

## Estructura de Proyecto

```
project/
├── app/                          # FRAMEWORKS & DRIVERS
│   ├── (auth)/
│   │   └── sign-in/page.tsx
│   ├── api/
│   │   └── todos/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── di/                           # Dependency Injection
│   ├── container.ts
│   └── modules/
│       ├── todos.module.ts
│       └── auth.module.ts
├── drizzle/                      # DB (separado de src)
│   ├── schema.ts
│   └── migrations/
├── src/
│   ├── interface-adapters/       # INTERFACE ADAPTERS
│   │   └── controllers/
│   │       └── todos.controller.ts
│   ├── application/              # APPLICATION
│   │   ├── use-cases/
│   │   │   ├── create-todo.use-case.ts
│   │   │   └── toggle-todo.use-case.ts
│   │   └── repositories/
│   │       └── todos.repository.interface.ts
│   ├── entities/                 # ENTITIES
│   │   ├── models/
│   │   │   └── todo.ts
│   │   └── errors/
│   │       └── todo.errors.ts
│   └── infrastructure/           # INFRASTRUCTURE
│       └── repositories/
│           └── todos.repository.ts
└── tests/
    └── unit/
```

## Entities (Models + Errors)

```typescript
// src/entities/models/todo.ts
export interface Todo {
  id: string;
  title: string;
  userId: string;
  completed: boolean;
  createdAt: Date;
}

// Validación "Enterprise Business Rules"
export function validateTodoTitle(title: string): boolean {
  return title.length >= 3 && title.length <= 100;
}
```

```typescript
// src/entities/errors/todo.errors.ts
export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('User is not authorized');
    this.name = 'UnauthorizedError';
  }
}
```

## Application (Use Cases + Interfaces)

```typescript
// src/application/repositories/todos.repository.interface.ts
import { Todo } from '@/entities/models/todo';

export interface ITodosRepository {
  getTodoById(id: string): Promise<Todo | null>;
  getTodosByUserId(userId: string): Promise<Todo[]>;
  createTodo(data: { title: string; userId: string }): Promise<Todo>;
  updateTodo(id: string, data: Partial<Todo>): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
}
```

```typescript
// src/application/use-cases/create-todo.use-case.ts
import { Todo, validateTodoTitle } from '@/entities/models/todo';
import { ITodosRepository } from '../repositories/todos.repository.interface';
import { IAuthService } from '../services/auth.service.interface';

export interface CreateTodoInput {
  title: string;
}

export class CreateTodoUseCase {
  constructor(
    private todosRepository: ITodosRepository,
    private authService: IAuthService
  ) {}

  async execute(input: CreateTodoInput): Promise<Todo> {
    // Authorization check
    const user = await this.authService.getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    // Business rule validation
    if (!validateTodoTitle(input.title)) {
      throw new InvalidTodoTitleError(input.title);
    }

    // Create via repository
    return this.todosRepository.createTodo({
      title: input.title,
      userId: user.id,
    });
  }
}
```

## Infrastructure (Implementations)

```typescript
// src/infrastructure/repositories/todos.repository.ts
import { db } from '@/drizzle';
import { todos } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ITodosRepository } from '@/application/repositories/todos.repository.interface';
import { Todo } from '@/entities/models/todo';
import { TodoNotFoundError } from '@/entities/errors/todo.errors';

export class TodosRepository implements ITodosRepository {
  async getTodoById(id: string): Promise<Todo | null> {
    const result = await db.select().from(todos).where(eq(todos.id, id));
    return result[0] ?? null;
  }

  async createTodo(data: { title: string; userId: string }): Promise<Todo> {
    const result = await db.insert(todos).values({
      id: crypto.randomUUID(),
      title: data.title,
      userId: data.userId,
      completed: false,
      createdAt: new Date(),
    }).returning();
    
    return result[0];
  }

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    const result = await db.update(todos)
      .set(data)
      .where(eq(todos.id, id))
      .returning();
    
    if (!result[0]) {
      throw new TodoNotFoundError(id);
    }
    
    return result[0];
  }
}
```

## Interface Adapters (Controllers)

```typescript
// src/interface-adapters/controllers/todos.controller.ts
import { CreateTodoUseCase } from '@/application/use-cases/create-todo.use-case';
import { GetTodosUseCase } from '@/application/use-cases/get-todos.use-case';

// Input validation schema (zod)
const createTodoSchema = z.object({
  title: z.string().min(3).max(100),
});

export class TodosController {
  constructor(
    private createTodoUseCase: CreateTodoUseCase,
    private getTodosUseCase: GetTodosUseCase
  ) {}

  // Controllers do:
  // 1. Input validation
  // 2. Authentication check (si aplica)
  // 3. Orchestrate use cases
  // 4. Transform output via Presenter

  async createTodo(input: unknown) {
    // Validate input
    const parsed = createTodoSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(parsed.error);
    }

    // Execute use case
    const todo = await this.createTodoUseCase.execute(parsed.data);

    // Present (transform for UI)
    return TodoPresenter.toResponse(todo);
  }

  async getTodos() {
    const todos = await this.getTodosUseCase.execute();
    return todos.map(TodoPresenter.toResponse);
  }
}

// Presenter - convierte data a formato UI-friendly
class TodoPresenter {
  static toResponse(todo: Todo) {
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      // No exponer userId u otros campos sensibles
    };
  }
}
```

## Dependency Injection (ioctopus)

```typescript
// di/container.ts
import { createContainer } from 'ioctopus';

export const DI_SYMBOLS = {
  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),
  
  // Services
  IAuthService: Symbol.for('IAuthService'),
  
  // Use Cases
  CreateTodoUseCase: Symbol.for('CreateTodoUseCase'),
  GetTodosUseCase: Symbol.for('GetTodosUseCase'),
  
  // Controllers
  TodosController: Symbol.for('TodosController'),
};

export const container = createContainer();
```

```typescript
// di/modules/todos.module.ts
import { container, DI_SYMBOLS } from '../container';
import { TodosRepository } from '@/infrastructure/repositories/todos.repository';
import { CreateTodoUseCase } from '@/application/use-cases/create-todo.use-case';
import { TodosController } from '@/interface-adapters/controllers/todos.controller';

// Bind implementations to interfaces
container.bind(DI_SYMBOLS.ITodosRepository).toClass(TodosRepository);

container.bind(DI_SYMBOLS.CreateTodoUseCase).toClass(CreateTodoUseCase, [
  DI_SYMBOLS.ITodosRepository,
  DI_SYMBOLS.IAuthService,
]);

container.bind(DI_SYMBOLS.TodosController).toClass(TodosController, [
  DI_SYMBOLS.CreateTodoUseCase,
  DI_SYMBOLS.GetTodosUseCase,
]);
```

## Frameworks & Drivers (Next.js)

```typescript
// app/api/todos/route.ts
import { container, DI_SYMBOLS } from '@/di/container';
import { TodosController } from '@/interface-adapters/controllers/todos.controller';
import { NextResponse } from 'next/server';

export async function GET() {
  const controller = container.get<TodosController>(DI_SYMBOLS.TodosController);
  
  try {
    const todos = await controller.getTodos();
    return NextResponse.json(todos);
  } catch (error) {
    // Handle errors
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const controller = container.get<TodosController>(DI_SYMBOLS.TodosController);
  const body = await request.json();
  
  try {
    const todo = await controller.createTodo(body);
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    // Handle specific errors
  }
}
```

```typescript
// app/todos/actions.ts
'use server'

import { container, DI_SYMBOLS } from '@/di/container';
import { TodosController } from '@/interface-adapters/controllers/todos.controller';
import { revalidatePath } from 'next/cache';

export async function createTodoAction(formData: FormData) {
  const controller = container.get<TodosController>(DI_SYMBOLS.TodosController);
  
  await controller.createTodo({
    title: formData.get('title'),
  });
  
  revalidatePath('/todos');
}
```

## Reglas de Dependencia (ESLint)

```json
// .eslintrc.json
{
  "plugins": ["boundaries"],
  "settings": {
    "boundaries/elements": [
      { "type": "app", "pattern": "app/*" },
      { "type": "interface-adapters", "pattern": "src/interface-adapters/*" },
      { "type": "application", "pattern": "src/application/*" },
      { "type": "entities", "pattern": "src/entities/*" },
      { "type": "infrastructure", "pattern": "src/infrastructure/*" }
    ],
    "boundaries/rules": [
      {
        "from": "entities",
        "disallow": ["application", "interface-adapters", "infrastructure", "app"]
      },
      {
        "from": "application",
        "disallow": ["interface-adapters", "infrastructure", "app"]
      }
    ]
  }
}
```

## Anti-patterns a Evitar

- ❌ Use Cases que usan otros Use Cases (dividí en casos más pequeños)
- ❌ Controllers con lógica de negocio (solo orquestan)
- ❌ Repositories con business rules (solo CRUD)
- ❌ Importar infrastructure desde application
- ❌ Acceder a DB directamente desde app/
- ❌ Errores de Drizzle/Prisma llegando al UI (convertir a custom errors)

## Cuándo NO usar Clean Architecture

- MVP o prototipos rápidos
- Proyectos que no van a crecer
- Equipos de 1 persona en proyectos simples

Empezá simple, refactoreá gradualmente cuando el proyecto crezca.
