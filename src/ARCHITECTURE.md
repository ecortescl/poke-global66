# 🏗️ Arquitectura Clean - Poke Global 66

## 📋 Principios SOLID Implementados

### 1. **Single Responsibility Principle (SRP)**

Cada módulo tiene una única razón para cambiar:

- **Servicios**: Solo manejan llamadas HTTP
- **Stores**: Solo manejan estado global
- **Composables**: Solo manejan lógica de negocio específica
- **Componentes UI**: Solo manejan presentación básica

### 2. **Open/Closed Principle (OCP)**

El código está abierto para extensión, cerrado para modificación:

- Nuevos tipos de Pokémon se pueden agregar sin modificar código existente
- Nuevos filtros se pueden implementar extendiendo interfaces

### 3. **Liskov Substitution Principle (LSP)**

Los componentes pueden ser intercambiados sin romper funcionalidad:

- Todos los componentes de lista implementan la misma interfaz
- Los loaders son intercambiables

### 4. **Interface Segregation Principle (ISP)**

Interfaces específicas en lugar de una grande:

- Tipos separados para Pokémon básico vs detallado
- Props específicas para cada componente

### 5. **Dependency Inversion Principle (DIP)**

Dependencias de abstracciones, no de implementaciones:

- Composables dependen de servicios, no de implementaciones HTTP específicas
- Componentes dependen de stores, no de localStorage directamente

## 🗂️ Estructura de Carpetas

```
src/
├── components/
│   ├── ui/                     # Componentes básicos reutilizables
│   │   ├── LoadingSpinner.vue
│   │   ├── SearchInput.vue
│   │   ├── PokeBallLoader.vue
│   │   └── index.js
│   ├── layout/                 # Componentes de estructura
│   │   ├── BottomNavigation.vue
│   │   └── index.js
│   ├── features/               # Componentes específicos de funcionalidad
│   │   ├── pokemon/
│   │   │   ├── PokemonCard.vue
│   │   │   ├── PokemonList.vue
│   │   │   ├── PokemonInfiniteList.vue
│   │   │   ├── FavoritePokemonList.vue
│   │   │   └── index.js
│   │   └── search/
│   │       ├── SearchResultsList.vue
│   │       └── index.js
│   └── common/                 # Componentes comunes (futuro)
├── composables/                # Lógica de negocio reutilizable
│   ├── useSearchPokemon.js
│   └── __tests__/
├── services/                   # Capa de servicios (HTTP, API)
│   └── pokemonService.js
├── stores/                     # Estado global (Pinia)
│   ├── pokemon.js
│   ├── favorites.js
│   └── __tests__/
├── utils/                      # Utilidades puras
│   ├── debounce.js
│   └── constants.js
├── types/                      # Definiciones de tipos
│   └── pokemon.js
├── views/                      # Páginas/vistas
├── router/                     # Configuración de rutas
└── assets/                     # Recursos estáticos
```

## 🔄 Flujo de Datos

### 1. **Capa de Presentación** (Views/Components)

- Recibe eventos del usuario
- Muestra datos del estado
- Delega lógica a composables

### 2. **Capa de Lógica de Negocio** (Composables)

- Procesa reglas de negocio
- Coordina servicios y stores
- Maneja estados locales complejos

### 3. **Capa de Estado** (Stores)

- Almacena estado global
- Persiste datos importantes
- Notifica cambios reactivamente

### 4. **Capa de Servicios** (Services)

- Maneja comunicación externa
- Abstrae APIs
- Maneja errores de red

### 5. **Capa de Utilidades** (Utils)

- Funciones puras
- Helpers reutilizables
- Constantes globales

## 🎯 Beneficios de esta Arquitectura

### ✅ **Mantenibilidad**

- Código organizado por responsabilidades
- Fácil localización de bugs
- Cambios aislados por capas

### ✅ **Testabilidad**

- Cada capa se puede testear independientemente
- Mocks fáciles de implementar
- Lógica separada de UI

### ✅ **Escalabilidad**

- Nuevas features se integran fácilmente
- Componentes reutilizables
- Arquitectura preparada para crecimiento

### ✅ **Legibilidad**

- Estructura clara y predecible
- Importaciones organizadas
- Documentación integrada

## 🔧 Patrones Implementados

### **Repository Pattern**

- `pokemonService.js` actúa como repository
- Abstrae la fuente de datos
- Facilita testing con mocks

### **Composition Pattern**

- Composables para lógica reutilizable
- Separación de concerns
- Mejor que mixins

### **Barrel Exports**

- Archivos `index.js` en cada carpeta
- Importaciones más limpias
- Punto de entrada único por módulo

### **Strategy Pattern**

- Diferentes estrategias de carga (infinita, paginada)
- Filtros intercambiables
- Loaders personalizables

## 📝 Convenciones de Código

### **Naming**

- **Componentes**: PascalCase (`PokemonCard.vue`)
- **Composables**: camelCase con prefijo `use` (`useSearchPokemon.js`)
- **Servicios**: camelCase con sufijo `Service` (`pokemonService.js`)
- **Stores**: camelCase (`favorites.js`)

### **Imports**

```javascript
// ✅ Barrel imports
import { SearchInput } from '@/components/ui'
import { PokemonCard } from '@/components/features/pokemon'

// ❌ Direct imports
import SearchInput from '@/components/ui/SearchInput.vue'
```

### **File Organization**

- Un componente por archivo
- Archivos relacionados en la misma carpeta
- Tests junto a su implementación

## 🚀 Próximos Pasos

1. **Implementar más servicios** (caching, offline)
2. **Agregar más tipos** (TypeScript migration)
3. **Mejorar testing** (coverage completo)
4. **Optimizar performance** (lazy loading, code splitting)
5. **Implementar PWA** (service workers, offline first)

Esta arquitectura está diseñada para crecer y mantenerse limpia a medida que el proyecto evoluciona.
