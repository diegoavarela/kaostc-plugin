# Layouts - SwiftUI

Layouts nativos para macOS y iOS.

## macOS - NavigationSplitView

### Sidebar + Detail (2 columnas)

```swift
struct MainView: View {
    @State private var selection: NavigationItem? = .home
    
    var body: some View {
        NavigationSplitView {
            Sidebar(selection: $selection)
        } detail: {
            DetailView(item: selection)
        }
        .navigationSplitViewStyle(.balanced)
    }
}

struct Sidebar: View {
    @Binding var selection: NavigationItem?
    
    var body: some View {
        List(selection: $selection) {
            Section("Main") {
                ForEach(NavigationItem.main) { item in
                    Label(item.title, systemImage: item.icon)
                        .tag(item)
                }
            }
            
            Section("Settings") {
                ForEach(NavigationItem.settings) { item in
                    Label(item.title, systemImage: item.icon)
                        .tag(item)
                }
            }
        }
        .listStyle(.sidebar)
        .navigationTitle("App Name")
    }
}
```

### Sidebar + Content + Detail (3 columnas)

```swift
NavigationSplitView {
    Sidebar(selection: $selection)
} content: {
    ContentList(category: selection, itemSelection: $itemSelection)
} detail: {
    ItemDetail(item: itemSelection)
}
.navigationSplitViewStyle(.balanced)
```

### Control de columnas

```swift
@State private var columnVisibility: NavigationSplitViewVisibility = .all

NavigationSplitView(columnVisibility: $columnVisibility) {
    Sidebar()
} detail: {
    Detail()
}

// Toolbar button para toggle
.toolbar {
    ToolbarItem(placement: .navigation) {
        Button {
            withAnimation {
                columnVisibility = columnVisibility == .all ? .detailOnly : .all
            }
        } label: {
            Image(systemName: "sidebar.left")
        }
    }
}
```

## iOS - TabView

```swift
struct MainTabView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }
                .tag(0)
            
            SearchView()
                .tabItem {
                    Label("Search", systemImage: "magnifyingglass")
                }
                .tag(1)
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
                .tag(2)
        }
    }
}
```

## Responsive - Size Classes

```swift
struct AdaptiveView: View {
    @Environment(\.horizontalSizeClass) var horizontalSizeClass
    
    var body: some View {
        if horizontalSizeClass == .compact {
            // iPhone portrait, slide over
            CompactLayout()
        } else {
            // iPad, iPhone landscape, macOS
            RegularLayout()
        }
    }
}
```

### ViewThatFits (iOS 16+)

```swift
ViewThatFits {
    // Intenta este primero
    HStack {
        ForEach(items) { item in
            ItemView(item: item)
        }
    }
    
    // Si no cabe, usa este
    VStack {
        ForEach(items) { item in
            ItemView(item: item)
        }
    }
}
```

## Navigation Stack (iOS 16+)

```swift
struct ContentView: View {
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: item) {
                    ItemRow(item: item)
                }
            }
            .navigationTitle("Items")
            .navigationDestination(for: Item.self) { item in
                ItemDetail(item: item)
            }
            .navigationDestination(for: Category.self) { category in
                CategoryView(category: category)
            }
        }
    }
    
    // Programmatic navigation
    func navigateToItem(_ item: Item) {
        path.append(item)
    }
    
    func popToRoot() {
        path.removeLast(path.count)
    }
}
```

## Sheets y Popovers

### Sheet

```swift
struct ParentView: View {
    @State private var showSheet = false
    
    var body: some View {
        Button("Show Sheet") {
            showSheet = true
        }
        .sheet(isPresented: $showSheet) {
            SheetContent()
                .presentationDetents([.medium, .large])  // iOS 16+
                .presentationDragIndicator(.visible)
        }
    }
}

// Sheet con item
.sheet(item: $selectedItem) { item in
    ItemEditor(item: item)
}
```

### Popover (mejor para macOS)

```swift
.popover(isPresented: $showPopover, arrowEdge: .bottom) {
    PopoverContent()
        .frame(width: 300, height: 400)
}
```

### Inspector (macOS, iPadOS)

```swift
NavigationSplitView {
    Sidebar()
} detail: {
    DetailView()
        .inspector(isPresented: $showInspector) {
            InspectorView()
                .inspectorColumnWidth(min: 200, ideal: 250, max: 300)
        }
}
```

## Settings Window (macOS)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        
        #if os(macOS)
        Settings {
            SettingsView()
        }
        #endif
    }
}

struct SettingsView: View {
    var body: some View {
        TabView {
            GeneralSettings()
                .tabItem {
                    Label("General", systemImage: "gear")
                }
            
            AccountSettings()
                .tabItem {
                    Label("Account", systemImage: "person")
                }
        }
        .frame(width: 450, height: 300)
    }
}
```

## Window Management (macOS)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        // Main window
        WindowGroup {
            ContentView()
        }
        .windowStyle(.automatic)
        .defaultSize(width: 900, height: 600)
        .commands {
            CommandGroup(replacing: .newItem) { }  // Remove new window
        }
        
        // Secondary window type
        WindowGroup("Editor", for: Document.ID.self) { $documentId in
            if let id = documentId {
                DocumentEditor(documentId: id)
            }
        }
        .defaultSize(width: 600, height: 400)
        
        // Menu bar extra
        MenuBarExtra("Quick Actions", systemImage: "star.fill") {
            QuickActionsMenu()
        }
        .menuBarExtraStyle(.window)
    }
}
```

### Open Window Programmatically

```swift
@Environment(\.openWindow) var openWindow

Button("Open Editor") {
    openWindow(value: document.id)
}
```

## Toolbar

```swift
.toolbar {
    // macOS: leading
    ToolbarItem(placement: .navigation) {
        Button { } label: {
            Image(systemName: "sidebar.left")
        }
    }
    
    // Automatic placement
    ToolbarItem {
        Button { } label: {
            Image(systemName: "plus")
        }
    }
    
    // Primary action
    ToolbarItem(placement: .primaryAction) {
        Button("Save") { }
    }
    
    // iOS: bottom bar
    ToolbarItem(placement: .bottomBar) {
        Button { } label: {
            Image(systemName: "square.and.arrow.up")
        }
    }
}

// Toolbar con ID para customización
.toolbar(id: "main") {
    ToolbarItem(id: "add", placement: .primaryAction) {
        Button { } label: { Image(systemName: "plus") }
    }
}
.toolbarRole(.editor)
```

## Safe Area

```swift
// Ignorar safe area
.ignoresSafeArea()
.ignoresSafeArea(.keyboard)
.ignoresSafeArea(edges: .bottom)

// Leer safe area
GeometryReader { proxy in
    let safeArea = proxy.safeAreaInsets
    // ...
}

// Content margins (iOS 17+)
.contentMargins(.horizontal, 20)
```

## Scroll Views

```swift
ScrollView {
    LazyVStack(spacing: 12) {
        ForEach(items) { item in
            ItemRow(item: item)
        }
    }
    .padding()
}
.scrollIndicators(.hidden)
.scrollDismissesKeyboard(.interactively)

// Con refresh
.refreshable {
    await loadData()
}

// Scroll position (iOS 17+)
@State private var scrollPosition: Item.ID?

ScrollView {
    LazyVStack {
        ForEach(items) { item in
            ItemRow(item: item)
                .id(item.id)
        }
    }
}
.scrollPosition(id: $scrollPosition)
```

## Checklist

- [ ] Usa NavigationSplitView para macOS con sidebar
- [ ] Usa TabView para iOS
- [ ] Size classes para responsive
- [ ] NavigationStack para drill-down
- [ ] Sheets/Popovers apropiados por plataforma
- [ ] Toolbar configurado correctamente
- [ ] Safe area respetada
