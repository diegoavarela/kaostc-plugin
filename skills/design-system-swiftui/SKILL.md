# Design System - SwiftUI

Sistema de diseño para apps macOS/iOS consistentes.

## Color Assets

Crear en `Assets.xcassets`:

```
Assets.xcassets/
├── Colors/
│   ├── AccentColor.colorset/
│   ├── BackgroundPrimary.colorset/
│   ├── BackgroundSecondary.colorset/
│   ├── TextPrimary.colorset/
│   ├── TextSecondary.colorset/
│   ├── Border.colorset/
│   └── Destructive.colorset/
```

### Color Set JSON (ejemplo)

```json
// BackgroundPrimary.colorset/Contents.json
{
  "colors": [
    {
      "color": {
        "color-space": "srgb",
        "components": { "red": "1.0", "green": "1.0", "blue": "1.0", "alpha": "1.0" }
      },
      "idiom": "universal"
    },
    {
      "appearances": [{ "appearance": "luminosity", "value": "dark" }],
      "color": {
        "color-space": "srgb",
        "components": { "red": "0.11", "green": "0.11", "blue": "0.12", "alpha": "1.0" }
      },
      "idiom": "universal"
    }
  ]
}
```

### Uso

```swift
// Desde Assets
Color("BackgroundPrimary")
Color("AccentColor")

// Extension recomendada
extension Color {
    static let backgroundPrimary = Color("BackgroundPrimary")
    static let backgroundSecondary = Color("BackgroundSecondary")
    static let textPrimary = Color("TextPrimary")
    static let textSecondary = Color("TextSecondary")
    static let border = Color("Border")
    static let destructive = Color("Destructive")
}

// Uso
Text("Hello")
    .foregroundStyle(Color.textPrimary)
    .background(Color.backgroundPrimary)
```

## Typography Scale

```swift
enum AppFont {
    // Display
    static let displayLarge = Font.system(size: 57, weight: .regular)
    static let displayMedium = Font.system(size: 45, weight: .regular)
    static let displaySmall = Font.system(size: 36, weight: .regular)
    
    // Headline
    static let headlineLarge = Font.system(size: 32, weight: .semibold)
    static let headlineMedium = Font.system(size: 28, weight: .semibold)
    static let headlineSmall = Font.system(size: 24, weight: .semibold)
    
    // Title
    static let titleLarge = Font.system(size: 22, weight: .medium)
    static let titleMedium = Font.system(size: 16, weight: .medium)
    static let titleSmall = Font.system(size: 14, weight: .medium)
    
    // Body
    static let bodyLarge = Font.system(size: 16, weight: .regular)
    static let bodyMedium = Font.system(size: 14, weight: .regular)
    static let bodySmall = Font.system(size: 12, weight: .regular)
    
    // Label
    static let labelLarge = Font.system(size: 14, weight: .medium)
    static let labelMedium = Font.system(size: 12, weight: .medium)
    static let labelSmall = Font.system(size: 11, weight: .medium)
}

// Uso
Text("Title")
    .font(AppFont.headlineLarge)
```

### Preferir System Fonts

```swift
// Para la mayoría de casos, usar los built-in
.font(.largeTitle)
.font(.title)
.font(.headline)
.font(.body)
.font(.caption)

// Solo usar AppFont para casos especiales que no mapean
```

## Spacing Tokens

```swift
enum Spacing {
    static let xxxs: CGFloat = 2
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 20
    static let xl: CGFloat = 24
    static let xxl: CGFloat = 32
    static let xxxl: CGFloat = 40
}

// Uso
VStack(spacing: Spacing.md) {
    Text("Title")
    Text("Subtitle")
}
.padding(Spacing.lg)
```

## Corner Radius

```swift
enum CornerRadius {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 12
    static let lg: CGFloat = 16
    static let xl: CGFloat = 20
    static let full: CGFloat = 9999  // Pill shape
}

// Uso
.clipShape(RoundedRectangle(cornerRadius: CornerRadius.md))
```

## Shadows

```swift
extension View {
    func shadowSm() -> some View {
        shadow(color: .black.opacity(0.05), radius: 2, y: 1)
    }
    
    func shadowMd() -> some View {
        shadow(color: .black.opacity(0.1), radius: 4, y: 2)
    }
    
    func shadowLg() -> some View {
        shadow(color: .black.opacity(0.15), radius: 8, y: 4)
    }
    
    func shadowXl() -> some View {
        shadow(color: .black.opacity(0.2), radius: 16, y: 8)
    }
}

// Uso
Card()
    .shadowMd()
```

## Icon Sizes

```swift
enum IconSize {
    static let xs: CGFloat = 12
    static let sm: CGFloat = 16
    static let md: CGFloat = 20
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
}

// Uso
Image(systemName: "star.fill")
    .font(.system(size: IconSize.md))
```

## Component Tokens

### Buttons

```swift
enum ButtonSize {
    case small, medium, large
    
    var height: CGFloat {
        switch self {
        case .small: return 32
        case .medium: return 40
        case .large: return 48
        }
    }
    
    var horizontalPadding: CGFloat {
        switch self {
        case .small: return 12
        case .medium: return 16
        case .large: return 20
        }
    }
    
    var font: Font {
        switch self {
        case .small: return .subheadline.weight(.medium)
        case .medium: return .body.weight(.medium)
        case .large: return .body.weight(.semibold)
        }
    }
}
```

### Inputs

```swift
enum InputSize {
    case small, medium, large
    
    var height: CGFloat {
        switch self {
        case .small: return 32
        case .medium: return 40
        case .large: return 48
        }
    }
    
    var padding: CGFloat {
        switch self {
        case .small: return 8
        case .medium: return 12
        case .large: return 16
        }
    }
}
```

## Theme Manager

```swift
class ThemeManager: ObservableObject {
    @AppStorage("colorScheme") var colorSchemePreference: String = "system"
    
    var resolvedColorScheme: ColorScheme? {
        switch colorSchemePreference {
        case "light": return .light
        case "dark": return .dark
        default: return nil  // System
        }
    }
}

// En App
@main
struct MyApp: App {
    @StateObject private var theme = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(theme)
                .preferredColorScheme(theme.resolvedColorScheme)
        }
    }
}
```

## Design Tokens File

Crear `DesignTokens.swift`:

```swift
import SwiftUI

// MARK: - Colors
extension Color {
    // Backgrounds
    static let backgroundPrimary = Color("BackgroundPrimary")
    static let backgroundSecondary = Color("BackgroundSecondary")
    static let backgroundTertiary = Color("BackgroundTertiary")
    
    // Text
    static let textPrimary = Color("TextPrimary")
    static let textSecondary = Color("TextSecondary")
    static let textTertiary = Color("TextTertiary")
    
    // Semantic
    static let success = Color("Success")
    static let warning = Color("Warning")
    static let error = Color("Error")
    static let info = Color("Info")
    
    // Border
    static let borderDefault = Color("Border")
    static let borderStrong = Color("BorderStrong")
}

// MARK: - Spacing
enum Spacing {
    static let xxxs: CGFloat = 2
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 20
    static let xl: CGFloat = 24
    static let xxl: CGFloat = 32
    static let xxxl: CGFloat = 40
}

// MARK: - Corner Radius
enum CornerRadius {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 12
    static let lg: CGFloat = 16
    static let xl: CGFloat = 20
}

// MARK: - Duration
enum Duration {
    static let fast: Double = 0.15
    static let normal: Double = 0.25
    static let slow: Double = 0.4
}
```

## Checklist

- [ ] Color Assets creados en xcassets
- [ ] Extension Color con todos los tokens
- [ ] Spacing enum usado consistentemente
- [ ] CornerRadius enum usado
- [ ] No hay magic numbers
- [ ] Dark/light mode funciona
- [ ] Typography usa system fonts o AppFont
