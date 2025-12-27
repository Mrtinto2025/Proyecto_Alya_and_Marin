# Alya & Marin Hub 🌸

Portal web completo de Anime y Manga con Alya (Alisa Mikhailovna Kujou) y Marin Kitagawa como mascotas del sitio.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de Datos:** MongoDB + Mongoose
- **Autenticación:** NextAuth.js con credenciales
- **Seguridad:** bcryptjs para hash de contraseñas, Zod para validación

## 📋 Características

### FASE 1 - MVP (Implementado)
- ✅ Sistema de autenticación seguro (registro/login)
- ✅ Conexión a MongoDB
- ✅ Layout principal con Navbar y Footer responsivos
- ✅ Tema oscuro/claro
- ✅ Landing page con Alya & Marin
- ✅ Modelos de base de datos (User, AnimeList, MangaList)

### Próximas Fases
- 🔜 Anime Explorer (búsqueda y catálogo)
- 🔜 Manga Reader
- 🔜 Community Hub (foros y discusiones)
- 🔜 Fan Art Gallery

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Copia `.env.example` a `.env.local` y configura:
```env
MONGODB_URI=mongodb://localhost:27017/alya-marin-hub
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-seguro-aqui
NODE_ENV=development
```

Para generar un NEXTAUTH_SECRET seguro:
```bash
openssl rand -base64 32
```

3. **Asegúrate de tener MongoDB corriendo:**
- Instalación local: Inicia el servicio de MongoDB
- MongoDB Atlas: Usa la URL de conexión de tu cluster

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
Proyecto_Alya_and_Marin/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts         # Configuración NextAuth
│   │       └── register/
│   │           └── route.ts         # Endpoint de registro
│   ├── login/
│   │   └── page.tsx                 # Página de login
│   ├── register/
│   │   └── page.tsx                 # Página de registro
│   ├── globals.css                  # Estilos globales
│   ├── layout.tsx                   # Layout principal
│   └── page.tsx                     # Landing page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Barra de navegación
│   │   └── Footer.tsx               # Pie de página
│   └── Providers.tsx                # Providers (Session, Theme)
├── lib/
│   ├── mongodb.ts                   # Conexión a MongoDB
│   ├── validations.ts               # Schemas de Zod
│   ├── types.ts                     # Tipos TypeScript
│   └── utils.ts                     # Funciones auxiliares
├── models/
│   ├── User.ts                      # Modelo de Usuario
│   ├── AnimeList.ts                 # Modelo de Lista de Anime
│   └── MangaList.ts                 # Modelo de Lista de Manga
├── types/
│   └── next-auth.d.ts               # Tipos de NextAuth
└── package.json
```

## 🔐 Seguridad Implementada

- **Hash de contraseñas:** bcryptjs con salt rounds = 12
- **Validación robusta:** Zod schemas con requisitos estrictos
- **Sesiones seguras:** JWT con NextAuth
- **Variables de entorno:** Datos sensibles protegidos
- **Validación de contraseñas:**
	- Mínimo 8 caracteres
	- Al menos una mayúscula
	- Al menos una minúscula
	- Al menos un número
	- Al menos un carácter especial

## 🎨 Temas y Diseño

- **Colores principales:**
	- Primary: Pink/Magenta (inspirado en Marin)
	- Secondary: Blue (inspirado en Alya)
- **Dark mode** por defecto
- **Animaciones suaves** con Tailwind y CSS custom
- **Responsive design** para mobile, tablet y desktop

## 🚧 Próximos Pasos

1. Integrar API de anime (Jikan/AniList)
2. Crear sistema de listas de usuario
3. Implementar búsqueda y filtros avanzados
4. Agregar sistema de reviews y ratings
5. Crear foros y sistema de comentarios
6. Implementar galería de fan art

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linter
npm run lint
```

## 🤝 Contribución

Este es un proyecto personal en desarrollo activo. Las contribuciones son bienvenidas una vez que se complete la fase MVP.

## 📄 Licencia

Proyecto personal - En desarrollo

---

Hecho con 💖 por un fan del anime
# Proyecto_Alya_and_Marin
Primer proyecto de prueba con varias cosas 
