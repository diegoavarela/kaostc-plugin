# Premium UI - SwiftUI

UI de alta calidad para macOS/iOS. No templates genéricos.

## Principios

1. **Nativo primero** - Usa componentes del sistema, no reinventes
2. **Materials y vibrancy** - El blur es parte del lenguaje de diseño de Apple
3. **Espaciado consistente** - Múltiplos de 4pt (8, 12, 16, 20, 24)
4. **SF Symbols** - Iconografía nativa, no assets custom

## Materials y Vibrancy

```swift
// Background con vibrancy (macOS)
.background(.ultraThinMaterial)
.background(.thinMaterial)
.background(.regularMaterial)
.background(.thickMaterial)

// Para ventanas
.background(VisualEffectView(material: .sidebar))
.background(VisualEffectView(material: .headerView))

// iOS
.background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
```

### VisualEffectView para macOS

```swift
struct VisualEffectView: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    
    func makeNSView(context: Context) -> NSVisualEffectView {
        let view = NSVisualEffectView()
        view.material = material
        view.blendingMode = .behindWindow
        view.state = .active
        return view
    }
    
    func updateNSView(_ nsView: NSVisualEffectView, context: Context) {
        nsView.material = material
    }
}
```

## Colores

```swift
// Semantic colors - SIEMPRE preferir estos
Color.primary           // Texto principal
Color.secondary         // Texto secundario
Color.accentColor       // Color de acento de la app

// Backgrounds
Color(nsColor: .windowBackgroundColor)      // macOS
Color(nsColor: .controlBackgroundColor)
Color(uiColor: .systemBackground)           // iOS
Color(uiColor: .secondarySystemBackground)

// NO hardcodear colores
// ❌ Color(red: 0.1, green: 0.1, blue: 0.1)
// ✅ Color(nsColor: .windowBackgroundColor)
```

### Dark/Light Mode

```swift
// Automático con semantic colors
Text("Hello")
    .foregroundStyle(.primary)  // Se adapta solo

// Si necesitás custom
@Environment(\.colorScheme) var colorScheme

var backgroundColor: Color {
    colorScheme == .dark ? Color.black.opacity(0.3) : Color.white.opacity(0.3)
}
```

## Tipografía

```swift
// System fonts - SIEMPRE usar estos
.font(.largeTitle)      // 34pt bold
.font(.title)           // 28pt bold
.font(.title2)          // 22pt bold
.font(.title3)          // 20pt semibold
.font(.headline)        // 17pt semibold
.font(.body)            // 17pt regular
.font(.callout)         // 16pt regular
.font(.subheadline)     // 15pt regular
.font(.footnote)        // 13pt regular
.font(.caption)         // 12pt regular
.font(.caption2)        // 11pt regular

// Con peso
.font(.body.weight(.medium))
.font(.title.bold())

// Monospace
.font(.system(.body, design: .monospaced))
```

## SF Symbols

```swift
// Básico
Image(systemName: "star.fill")

// Con configuración
Image(systemName: "folder.badge.plus")
    .symbolRenderingMode(.hierarchical)
    .foregroundStyle(.blue)

// Tamaños
Image(systemName: "gear")
    .font(.title2)

// Multicolor
Image(systemName: "externaldrive.fill.badge.checkmark")
    .symbolRenderingMode(.multicolor)

// Variable symbols (animables)
Image(systemName: "speaker.wave.3.fill", variableValue: volume)
```

### Símbolos comunes

```swift
// Navegación
"sidebar.left"
"chevron.right"
"arrow.left"
"house.fill"

// Acciones
"plus"
"minus"
"xmark"
"checkmark"
"trash"
"pencil"
"square.and.arrow.up"  // Share

// Estados
"checkmark.circle.fill"
"exclamationmark.triangle.fill"
"info.circle"

// Media
"play.fill"
"pause.fill"
"stop.fill"
```

## Spacing

```swift
// Stack spacing
VStack(spacing: 8) { }
VStack(spacing: 12) { }
VStack(spacing: 16) { }
VStack(spacing: 20) { }

// Padding
.padding(8)
.padding(12)
.padding(16)
.padding(20)

// Específico
.padding(.horizontal, 16)
.padding(.vertical, 12)

// Insets para listas
.listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
```

## Bordes y Sombras

```swift
// Bordes sutiles
.overlay(
    RoundedRectangle(cornerRadius: 8)
        .stroke(Color.primary.opacity(0.1), lineWidth: 1)
)

// Sombras nativas
.shadow(color: .black.opacity(0.1), radius: 4, y: 2)
.shadow(color: .black.opacity(0.15), radius: 8, y: 4)

// Para cards
.background(
    RoundedRectangle(cornerRadius: 12)
        .fill(Color(nsColor: .controlBackgroundColor))
        .shadow(color: .black.opacity(0.1), radius: 4, y: 2)
)
```

## Animaciones

```swift
// Siempre con animación
.animation(.easeInOut(duration: 0.2), value: isExpanded)

// Spring para interacciones
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: isPressed)

// Transiciones
.transition(.opacity)
.transition(.move(edge: .leading))
.transition(.asymmetric(insertion: .push(from: .trailing), removal: .push(from: .leading)))

// Matched geometry para transiciones fluidas
@Namespace var namespace

// En origen
.matchedGeometryEffect(id: "card", in: namespace)

// En destino
.matchedGeometryEffect(id: "card", in: namespace)
```

## Componentes Premium

### Card

```swift
struct PremiumCard<Content: View>: View {
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        content
            .padding(16)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.primary.opacity(0.1), lineWidth: 1)
            )
    }
}
```

### Button Styles

```swift
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundStyle(.white)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(Color.accentColor, in: RoundedRectangle(cornerRadius: 8))
            .opacity(configuration.isPressed ? 0.8 : 1)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundStyle(.primary)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.primary.opacity(0.2), lineWidth: 1)
            )
            .opacity(configuration.isPressed ? 0.8 : 1)
    }
}
```

### TextField Premium

```swift
struct PremiumTextField: View {
    let placeholder: String
    @Binding var text: String
    
    var body: some View {
        TextField(placeholder, text: $text)
            .textFieldStyle(.plain)
            .padding(12)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.primary.opacity(0.1), lineWidth: 1)
            )
    }
}
```

## Anti-patterns

```swift
// ❌ NO
Color(red: 0.2, green: 0.2, blue: 0.2)     // Hardcoded
.frame(width: 300, height: 400)             // Fixed sizes
.font(.system(size: 14))                    // Magic numbers
Image("custom-icon")                         // Custom cuando hay SF Symbol

// ✅ SÍ
Color(nsColor: .controlBackgroundColor)
.frame(maxWidth: .infinity)
.font(.body)
Image(systemName: "star.fill")
```

## Checklist

- [ ] Usa semantic colors
- [ ] Usa SF Symbols
- [ ] Usa system fonts (.body, .title, etc)
- [ ] Materials para backgrounds
- [ ] Spacing en múltiplos de 4
- [ ] Animaciones en interacciones
- [ ] Respeta dark/light mode
- [ ] No hay valores hardcodeados
