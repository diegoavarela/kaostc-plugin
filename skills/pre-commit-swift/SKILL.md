# Pre-commit - Swift

Checks antes de commit para proyectos Swift/macOS/iOS.

## Checks Obligatorios

### 1. Build

```bash
# macOS app
xcodebuild -scheme "AppName" -destination "platform=macOS" build

# iOS app
xcodebuild -scheme "AppName" -destination "platform=iOS Simulator,name=iPhone 15" build

# Swift Package
swift build
```

### 2. Tests

```bash
# macOS
xcodebuild test -scheme "AppName" -destination "platform=macOS"

# iOS
xcodebuild test -scheme "AppName" -destination "platform=iOS Simulator,name=iPhone 15"

# Swift Package
swift test
```

### 3. SwiftLint (si está instalado)

```bash
# Verificar si existe
which swiftlint

# Correr
swiftlint lint --strict

# Autocorregir
swiftlint lint --fix
```

#### Configuración recomendada (.swiftlint.yml)

```yaml
disabled_rules:
  - line_length  # Muy restrictivo para SwiftUI
  - trailing_whitespace

opt_in_rules:
  - empty_count
  - empty_string
  - force_unwrapping
  - implicitly_unwrapped_optional
  - private_outlet
  - private_action

excluded:
  - Pods
  - .build
  - DerivedData

line_length:
  warning: 150
  error: 200
  
type_body_length:
  warning: 300
  error: 500

file_length:
  warning: 500
  error: 1000
```

### 4. SwiftFormat (si está instalado)

```bash
# Verificar si existe
which swiftformat

# Verificar (sin modificar)
swiftformat . --lint

# Formatear
swiftformat .
```

#### Configuración recomendada (.swiftformat)

```
--swiftversion 5.9
--indent 4
--indentcase false
--trimwhitespace always
--voidtype void
--header strip
--disable redundantSelf
--disable trailingClosures
```

## Script de Pre-commit

Crear `.git/hooks/pre-commit`:

```bash
#!/bin/bash
set -e

echo "🔍 Running pre-commit checks..."

# Build
echo "📦 Building..."
if [ -f "Package.swift" ]; then
    swift build
elif [ -d "*.xcodeproj" ] || [ -d "*.xcworkspace" ]; then
    xcodebuild -scheme "$(xcodebuild -list -json | jq -r '.project.schemes[0]')" build
fi

# SwiftLint
if command -v swiftlint &> /dev/null; then
    echo "🧹 SwiftLint..."
    swiftlint lint --strict
fi

# SwiftFormat
if command -v swiftformat &> /dev/null; then
    echo "📐 SwiftFormat..."
    swiftformat . --lint
fi

# Tests
echo "🧪 Tests..."
if [ -f "Package.swift" ]; then
    swift test
else
    xcodebuild test -scheme "$(xcodebuild -list -json | jq -r '.project.schemes[0]')" -destination "platform=macOS" | xcpretty
fi

echo "✅ All checks passed!"
```

## Warnings como Errores

En Build Settings o xcconfig:

```
SWIFT_TREAT_WARNINGS_AS_ERRORS = YES
```

O en código:

```swift
#warning("TODO: Remove before commit")  // Falla el build
```

## Errores Comunes

### Force unwrap

```swift
// ❌ Falla SwiftLint
let value = optional!

// ✅ OK
guard let value = optional else { return }
if let value = optional { }
let value = optional ?? defaultValue
```

### Implicit unwrap

```swift
// ❌ Falla SwiftLint
var delegate: Delegate!

// ✅ OK
weak var delegate: Delegate?
```

### Force cast

```swift
// ❌ Falla SwiftLint
let view = object as! UIView

// ✅ OK
guard let view = object as? UIView else { return }
```

### Empty catch

```swift
// ❌ Falla SwiftLint
do {
    try something()
} catch {}

// ✅ OK
do {
    try something()
} catch {
    print("Error: \(error)")
}
```

### Magic numbers

```swift
// ❌ Code smell
.padding(16)
.cornerRadius(8)

// ✅ OK
.padding(Spacing.md)
.cornerRadius(CornerRadius.sm)
```

## Instalar Herramientas

### SwiftLint

```bash
# Homebrew
brew install swiftlint

# O en Xcode Build Phase
if which swiftlint > /dev/null; then
    swiftlint
else
    echo "warning: SwiftLint not installed"
fi
```

### SwiftFormat

```bash
# Homebrew
brew install swiftformat

# O SPM plugin
// Package.swift
.package(url: "https://github.com/nicklockwood/SwiftFormat", from: "0.52.0")
```

### xcpretty (output legible)

```bash
gem install xcpretty

# Uso
xcodebuild test | xcpretty
```

## CI Integration

### GitHub Actions

```yaml
name: Swift

on: [push, pull_request]

jobs:
  build:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: swift build
        
      - name: Test
        run: swift test
        
      - name: SwiftLint
        run: |
          brew install swiftlint
          swiftlint lint --strict
```

## Checklist Pre-commit

| Check | Comando | Debe pasar |
|-------|---------|------------|
| Build | `swift build` / `xcodebuild build` | ✅ Sin errores |
| Tests | `swift test` / `xcodebuild test` | ✅ Todos pasan |
| SwiftLint | `swiftlint lint --strict` | ✅ Sin warnings |
| SwiftFormat | `swiftformat . --lint` | ✅ Código formateado |
| Warnings | Build Settings | ✅ Cero warnings |

## Output Esperado

```
📦 Build: ✓ Succeeded
🧪 Tests: ✓ 42 passed
🧹 SwiftLint: ✓ No violations
📐 SwiftFormat: ✓ Formatted

Ready to commit!
```

O si falla:

```
🧹 SwiftLint: ✗ 3 violations
  - Views/HomeView.swift:42 force_unwrapping
  - Models/User.swift:15 implicitly_unwrapped_optional
  - Utilities/Helpers.swift:88 empty_catch

Fix these before committing.
```
