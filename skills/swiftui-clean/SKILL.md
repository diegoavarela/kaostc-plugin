# SwiftUI Clean Architecture Patterns

Basado en: github.com/nalexn/clean-architecture-swiftui (97% test coverage)

## Principios Core

SwiftUI es **declarativo y state-driven**. No podés referenciar views directamente ni mutarlas como reacción a eventos. Solo mutás el estado y la UI se actualiza.

**MVVM viene built-in en SwiftUI.** Los `@State` locales actúan como ViewModel. Para casos complejos, usá `@Observable`.

**Coordinator no es necesario.** La navegación programática se maneja con `Bindings` y `NavigationStack`. Usá generics o `@ViewBuilder` para desacoplar views.

## Arquitectura de 3 Capas

```
┌─────────────────────────────────────┐
│         PRESENTATION LAYER          │
│  SwiftUI Views (sin lógica)         │
│  Solo disparan side effects         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       BUSINESS LOGIC LAYER          │
│  AppState + Interactors             │
│  Independiente de UI y DB           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        DATA ACCESS LAYER            │
│  Repositories (async API)           │
│  CRUD operations                    │
└─────────────────────────────────────┘
```

## Estructura de Proyecto

```
App/
├── Injected/
│   └── AppState.swift           # Single source of truth
├── UI/
│   └── Screens/
│       └── FeatureName/
│           ├── FeatureView.swift
│           └── Components/
├── Interactors/
│   └── FeatureInteractor.swift  # Business logic
├── Repositories/
│   └── FeatureRepository.swift  # Data access
├── Models/
│   └── Feature.swift            # Data containers
└── Utilities/
```

## AppState (Single Source of Truth)

```swift
// Redux-like centralized state
@Observable
final class AppState {
    var userData = UserData()
    var routing = ViewRouting()
    var system = System()
}

struct UserData {
    var countries: Loadable<[Country]> = .notRequested
}

struct ViewRouting {
    var countriesList = CountriesList.Routing()
}
```

## Views (Presentation Layer)

```swift
struct CountriesList: View {
    // Inject via @Environment
    @Environment(\.interactors) var interactors
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        // UI es función del estado
        content
            .onAppear {
                // Side effects van a Interactor
                interactors.countriesInteractor.loadCountries()
            }
    }
    
    @ViewBuilder
    private var content: some View {
        switch appState.userData.countries {
        case .notRequested: notRequestedView
        case .isLoading: loadingView
        case .loaded(let countries): loadedView(countries)
        case .failed(let error): errorView(error)
        }
    }
}
```

## Interactors (Business Logic)

```swift
// Siempre detrás de protocol para testing
protocol CountriesInteractor {
    func loadCountries()
    func load(countryDetails: Binding<Loadable<Country.Details>>, country: Country)
}

struct RealCountriesInteractor: CountriesInteractor {
    let webRepository: CountriesWebRepository
    let appState: AppState
    
    func loadCountries() {
        // Nunca retorna data directamente
        // Siempre actualiza AppState o Binding
        appState.userData.countries = .isLoading(last: appState.userData.countries.value)
        
        Task {
            do {
                let countries = try await webRepository.loadCountries()
                appState.userData.countries = .loaded(countries)
            } catch {
                appState.userData.countries = .failed(error)
            }
        }
    }
    
    // Usa Binding cuando el dato es local a una View
    func load(countryDetails: Binding<Loadable<Country.Details>>, country: Country) {
        countryDetails.wrappedValue = .isLoading(last: countryDetails.wrappedValue.value)
        // ...
    }
}
```

## Repositories (Data Access)

```swift
// Protocol para mockear en tests
protocol CountriesWebRepository: WebRepository {
    func loadCountries() async throws -> [Country]
    func loadCountryDetails(country: Country) async throws -> Country.Details
}

struct RealCountriesWebRepository: CountriesWebRepository {
    let session: URLSession
    let baseURL: String
    
    func loadCountries() async throws -> [Country] {
        try await call(endpoint: API.allCountries)
    }
}

// Endpoints separados
extension RealCountriesWebRepository {
    enum API: APICall {
        case allCountries
        case countryDetails(Country)
        
        var path: String { ... }
        var httpMethod: String { ... }
        var headers: [String: String]? { ... }
    }
}
```

## Loadable Pattern

```swift
enum Loadable<T> {
    case notRequested
    case isLoading(last: T?)
    case loaded(T)
    case failed(Error)
    
    var value: T? {
        switch self {
        case .loaded(let value): return value
        case .isLoading(let last): return last
        default: return nil
        }
    }
}
```

## Dependency Injection

```swift
// Container de interactors
struct InteractorsContainer {
    let countriesInteractor: CountriesInteractor
    let imagesInteractor: ImagesInteractor
    
    static var stub: Self {
        .init(
            countriesInteractor: StubCountriesInteractor(),
            imagesInteractor: StubImagesInteractor()
        )
    }
}

// Environment key
struct InteractorsKey: EnvironmentKey {
    static let defaultValue: InteractorsContainer = .stub
}

extension EnvironmentValues {
    var interactors: InteractorsContainer {
        get { self[InteractorsKey.self] }
        set { self[InteractorsKey.self] = newValue }
    }
}

// Uso en App
@main
struct CountriesApp: App {
    let appState = AppState()
    let interactors: InteractorsContainer
    
    init() {
        interactors = .init(/* real implementations */)
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environment(\.interactors, interactors)
        }
    }
}
```

## Navegación Programática

```swift
struct ViewRouting {
    var showCountryDetails: Country.ID? = nil
    var showSettings: Bool = false
}

struct CountriesList: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationStack {
            List(countries) { country in
                Button(country.name) {
                    appState.routing.countriesList.showCountryDetails = country.id
                }
            }
            .navigationDestination(item: $appState.routing.countriesList.showCountryDetails) { id in
                CountryDetailsView(countryId: id)
            }
        }
    }
}
```

## Reglas de Testing

1. Views: Usá ViewInspector
2. Interactors: Mock de Repositories
3. Repositories: Mock de URLSession via URLProtocol

## Convenciones de Nombrado

- Models: `Country`, `User`, `Todo` (sustantivos singulares)
- Views: `CountriesList`, `CountryDetails` (sustantivo + contexto)
- Interactors: `CountriesInteractor`, `UserInteractor`
- Repositories: `CountriesWebRepository`, `UserDBRepository`

## Anti-patterns a Evitar

- ❌ Lógica de negocio en Views
- ❌ Views que acceden directamente a Repositories  
- ❌ Interactors que retornan data (solo actualizan state/binding)
- ❌ AppState con lógica (solo data)
- ❌ Coordinators (innecesarios en SwiftUI)
- ❌ @ObservableObject (usar @Observable de iOS 17+)
