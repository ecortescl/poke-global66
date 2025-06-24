# 🔥 PokéGlobal66

Una aplicación web moderna para explorar, coleccionar y compartir información de Pokémon, desarrollada con las últimas tecnologías del ecosistema Vue.js.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFC727?style=for-the-badge&logo=pinia&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## ✨ Características Principales

- 🌟 **Exploración completa**: Lista de 151 Pokémon de la primera generación
- ❤️ **Sistema de favoritos**: Guarda y gestiona tus Pokémon preferidos
- 🔍 **Búsqueda inteligente**: Encuentra cualquier Pokémon por nombre
- 📤 **Funcionalidad de compartir**: Comparte información de Pokémon con amigos
- 📱 **Diseño responsive**: Optimizado para dispositivos móviles y desktop
- ⚡ **Carga rápida**: Optimización con cache inteligente y lazy loading
- 🎨 **Interfaz moderna**: Diseño atractivo con animaciones fluidas

## 🛠️ Tecnologías Utilizadas

### **Vue 3 (Options API)**

- **Justificación**: Framework principal elegido por ser el estándar requerido. Se optó por Options API para seguir una convención específica, demostrando la capacidad de trabajar con este estilo de sintaxis de Vue.
- **Beneficios**: Estructura clara, fácil mantenimiento y excelente para equipos con diferentes niveles de experiencia.

### **Vite**

- **Justificación**: Utilizado como 'build tool' y servidor de desarrollo por su rapidez extrema, HMR (Hot Module Replacement) instantáneo y configuración sencilla.
- **Beneficios**:
  - Tiempo de arranque ultrarrápido
  - Recarga instantánea de módulos
  - Build optimizado para producción
  - Soporte nativo para ES modules

### **Tailwind CSS**

- **Justificación**: Framework CSS de clases de utilidad para un estilado rápido, consistente y altamente personalizable. Permite construir interfaces complejas directamente en el marcado.
- **Beneficios**:
  - Desarrollo más rápido sin escribir CSS personalizado
  - Diseño consistente y escalable
  - Optimización automática (purging)
  - Excelente para prototipado rápido

### **Pinia**

- **Justificación**: Gestor de estado elegido por su API más intuitiva y ligera que Vuex 4, ideal para Vue 3. Ofrece una mejor experiencia de desarrollo y una clara separación de la lógica del estado.
- **Beneficios**:
  - API más simple y moderna
  - Mejor soporte para TypeScript
  - DevTools integradas
  - Stores modulares y reutilizables

### **Vue Router**

- **Justificación**: Para la navegación entre vistas, permitiendo una experiencia de usuario de Single Page Application (SPA) fluida.
- **Beneficios**: Navegación declarativa, lazy loading de rutas, y guards de navegación.

### **Vitest**

- **Justificación**: Framework de pruebas unitarias optimizado para Vite, ofreciendo pruebas rápidas y una integración perfecta con el proyecto.
- **Beneficios**:
  - Configuración cero con Vite
  - Ejecución extremadamente rápida
  - API compatible con Jest
  - Soporte nativo para ES modules

### **Axios**

- **Justificación**: Cliente HTTP basado en promesas para realizar las peticiones a la PokéAPI de forma sencilla y eficiente.
- **Beneficios**: Interceptores, manejo de errores robusto, y amplio soporte de navegadores.

## 🏗️ Arquitectura del Proyecto

```
src/
├── assets/           # Recursos estáticos (CSS, imágenes)
├── components/       # Componentes reutilizables
│   ├── LoadingSpinner.vue      # Animación de carga con Pokeball
│   ├── PokemonCard.vue         # Card individual de Pokémon
│   ├── PokemonList.vue         # Lista principal con paginación
│   └── FavoritePokemonList.vue # Lista de favoritos
├── stores/          # Gestión de estado con Pinia
│   ├── pokemon.js   # Store principal de Pokémon
│   ├── favorites.js # Store de favoritos
│   └── __tests__/   # Tests unitarios de stores
├── views/           # Vistas principales (rutas)
│   ├── HomeView.vue # Vista principal de la aplicación
│   └── AboutView.vue
├── router/          # Configuración de Vue Router
└── main.js         # Punto de entrada de la aplicación
```

### **Decisiones de Arquitectura**

#### **1. Stores de Pinia - Separación de Responsabilidades**

- **`pokemon.js`**: Encapsula toda la lógica relacionada con la obtención y cache de datos de Pokémon
- **`favorites.js`**: Maneja exclusivamente la lógica de favoritos, incluyendo persistencia local

#### **2. Sistema de Cache Inteligente**

- Los detalles de Pokémon se almacenan en un `Map()` para evitar peticiones duplicadas
- Cache persistente para favoritos (funcionalidad futura con localStorage)

#### **3. Componentes Modulares**

- **`PokemonCard`**: Componente reutilizable usado tanto en la lista principal como en favoritos
- **`LoadingSpinner`**: Componente de carga con animación personalizada de Pokeball
- Cada componente tiene una responsabilidad específica y bien definida

#### **4. Gestión de Estado Reactivo**

- Uso de `mapState` y `mapActions` para integración limpia con Options API
- Estados reactivos que se actualizan automáticamente en toda la aplicación

## 🚀 Instalación y Configuración

### **Prerequisitos**

- Node.js (v18 o superior)
- npm o yarn

### **Instalación**

```bash
# Clonar el repositorio
git clone <repository-url>
cd poke-global66

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm run test:unit

# Build para producción
npm run build
```

### **Variables de Entorno**

El proyecto utiliza la PokéAPI pública, por lo que no requiere configuración adicional de variables de entorno.

## 🧪 Testing

El proyecto incluye una suite completa de tests unitarios usando **Vitest**:

```bash
# Ejecutar todos los tests
npm run test:unit

# Ejecutar tests en modo watch
npm run test:unit -- --watch

# Generar reporte de cobertura
npm run test:unit -- --coverage
```

### **Cobertura de Tests**

- ✅ **Pokemon Store**: Tests completos para carga de datos, cache, y manejo de errores
- ✅ **Favorites Store**: Tests para agregar/quitar favoritos, validaciones, y funciones de utilidad
- ✅ **Getters y Actions**: Cobertura completa de toda la lógica de negocio

## 🎯 Funcionalidades Implementadas

### **Core Features**

- [x] Lista completa de 151 Pokémon (Primera Generación)
- [x] Información detallada de cada Pokémon (tipos, habilidades, estadísticas)
- [x] Sistema de favoritos persistente
- [x] Funcionalidad de compartir información
- [x] Búsqueda por nombre
- [x] Paginación inteligente
- [x] Design responsive

### **UX/UI Features**

- [x] Loading states con animación de Pokeball
- [x] Estados vacíos informativos
- [x] Notificaciones de feedback
- [x] Navegación intuitiva entre secciones
- [x] Cards interactivas con hover effects
- [x] Badges visuales para tipos de Pokémon

### **Performance Features**

- [x] Cache inteligente de datos
- [x] Lazy loading de imágenes
- [x] Optimización de peticiones HTTP
- [x] Paginación para manejo eficiente de grandes datasets

## 🎨 Consideraciones de Diseño

### **Design System**

- **Colores**: Paleta inspirada en los colores oficiales de Pokémon
- **Tipografía**: System fonts para mejor rendimiento
- **Iconografía**: Emojis para mejor compatibilidad multiplataforma
- **Espaciado**: Sistema de espaciado consistente con Tailwind

### **Responsiveness**

- **Mobile First**: Diseño que escala desde móvil hacia desktop
- **Breakpoints**: Uso de breakpoints estándar de Tailwind
- **Touch Friendly**: Elementos táctiles optimizados para dispositivos móviles

## 🔧 Desafíos y Soluciones

### **1. Manejo de Gran Cantidad de Datos**

**Desafío**: La PokéAPI retorna gran cantidad de información que puede impactar el rendimiento.
**Solución**:

- Sistema de cache con `Map()` para evitar peticiones duplicadas
- Paginación en el frontend para mejor UX
- Lazy loading de detalles de Pokémon

### **2. Gestión de Estado Complejo**

**Desafío**: Manejar múltiples estados relacionados (lista, favoritos, loading states).
**Solución**:

- Separación clara de responsabilidades en diferentes stores
- Uso de getters reactivos para computed properties
- Actions asíncronas con manejo robusto de errores

### **3. Compatibilidad del API de Compartir**

**Desafío**: La Web Share API no está disponible en todos los navegadores.
**Solución**:

- Implementación de fallbacks progresivos
- Detección de capacidades del navegador
- Fallback a clipboard API y prompt manual

### **4. Testing de Stores Asíncronos**

**Desafío**: Testing de lógica asíncrona compleja con Pinia.
**Solución**:

- Mocking correcto de axios con vi.mock
- Setup adecuado de Pinia en tests
- Tests exhaustivos de casos edge

## 📈 Optimizaciones Implementadas

### **Performance**

- **Bundle Splitting**: Código dividido por rutas
- **Tree Shaking**: Eliminación automática de código no utilizado
- **Image Optimization**: Fallbacks para imágenes rotas
- **Network Optimization**: Cache de peticiones HTTP

### **Developer Experience**

- **Hot Module Replacement**: Desarrollo con recarga instantánea
- **TypeScript Ready**: Preparado para migración a TypeScript
- **Linting**: Configuración de ESLint y Prettier
- **Git Hooks**: Validación automática en commits

## 🚀 Próximas Mejoras

### **Funcionalidades Futuras**

- [ ] Persistencia de favoritos en localStorage
- [ ] Filtros avanzados por tipo, habilidad, etc.
- [ ] Vista de detalles individual por ruta
- [ ] Sistema de comparación de Pokémon
- [ ] Dark mode
- [ ] Internacionalización (i18n)

### **Mejoras Técnicas**

- [ ] Migración a Composition API
- [ ] Implementación de Service Workers (PWA)
- [ ] Tests end-to-end con Cypress/Playwright
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo de performance con Web Vitals

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m '✨ Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### **Convenciones de Commits**

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) con devemoji:

- `✨ feat:` Nueva funcionalidad
- `🐛 fix:` Corrección de bugs
- `📚 docs:` Documentación
- `🎨 style:` Cambios de estilo/formato
- `♻️ refactor:` Refactoring de código
- `🧪 test:` Agregar o modificar tests

## 👥 Equipo

Desarrollado con ❤️ por el equipo de Global66, demostrando expertise en:

- Vue.js 3 ecosystem
- Modern frontend development
- Testing strategies
- Performance optimization
- UX/UI best practices

---

## 📄 Licencia

Este proyecto es privado y pertenece a Global66. Todos los derechos reservados.

## 🙏 Agradecimientos

- [PokéAPI](https://pokeapi.co/) por proporcionar los datos de Pokémon
- Comunidad de Vue.js por las excelentes herramientas
- The Pokémon Company por crear este increíble universo

---

> "Gotta Code 'Em All!" 🔥⚡

**Datos técnicos adicionales disponibles en la documentación de cada componente y store.**
