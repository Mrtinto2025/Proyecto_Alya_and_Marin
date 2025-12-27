# 📚 Documentación de APIs - Alya & Marin Hub

## 🔐 Autenticación

### Registro de Usuario
**POST** `/api/auth/register`

```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "676...",
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user"
  }
}
```

### Login
**POST** `/api/auth/signin`
Usa NextAuth - redirige a la página de login configurada.

---

## 👤 Perfil de Usuario

### Obtener Perfil
**GET** `/api/user/profile`

Requiere autenticación.

**Respuesta (200):**
```json
{
  "user": {
    "_id": "676...",
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "bio": "Amante del anime y manga",
    "image": "url-imagen",
    "favoriteAnime": ["anime1", "anime2"],
    "favoriteManga": ["manga1", "manga2"],
    "createdAt": "2024-12-27T...",
    "updatedAt": "2024-12-27T..."
  }
}
```

### Actualizar Perfil
**PUT** `/api/user/profile`

Requiere autenticación.

```json
{
  "username": "nuevoUsuario",
  "bio": "Nueva biografía",
  "image": "nueva-url-imagen"
}
```

---

## 📺 Lista de Anime

### Obtener Lista de Anime
**GET** `/api/anime/list?status=watching`

Parámetros opcionales:
- `status`: `watching`, `completed`, `plan-to-watch`, `dropped`, `on-hold`

Requiere autenticación.

**Respuesta (200):**
```json
{
  "animeList": [
    {
      "_id": "676...",
      "userId": "676...",
      "animeId": "anime123",
      "status": "watching",
      "rating": 8,
      "episodesWatched": 12,
      "notes": "Me encanta este anime",
      "createdAt": "2024-12-27T...",
      "updatedAt": "2024-12-27T..."
    }
  ]
}
```

### Agregar Anime a la Lista
**POST** `/api/anime/list`

Requiere autenticación.

```json
{
  "animeId": "anime123",
  "status": "watching",
  "rating": 8,
  "episodesWatched": 12,
  "notes": "Notas opcionales"
}
```

### Obtener Anime Específico
**GET** `/api/anime/list/[id]`

Requiere autenticación.

### Actualizar Anime
**PUT** `/api/anime/list/[id]`

Requiere autenticación.

```json
{
  "status": "completed",
  "rating": 9,
  "episodesWatched": 24,
  "notes": "Actualizado"
}
```

### Eliminar Anime
**DELETE** `/api/anime/list/[id]`

Requiere autenticación.

---

## 📖 Lista de Manga

### Obtener Lista de Manga
**GET** `/api/manga/list?status=reading`

Parámetros opcionales:
- `status`: `reading`, `completed`, `plan-to-read`, `dropped`, `on-hold`

Requiere autenticación.

**Respuesta (200):**
```json
{
  "mangaList": [
    {
      "_id": "676...",
      "userId": "676...",
      "mangaId": "manga123",
      "status": "reading",
      "rating": 9,
      "chaptersRead": 50,
      "notes": "Excelente manga",
      "createdAt": "2024-12-27T...",
      "updatedAt": "2024-12-27T..."
    }
  ]
}
```

### Agregar Manga a la Lista
**POST** `/api/manga/list`

Requiere autenticación.

```json
{
  "mangaId": "manga123",
  "status": "reading",
  "rating": 9,
  "chaptersRead": 50,
  "notes": "Notas opcionales"
}
```

### Obtener Manga Específico
**GET** `/api/manga/list/[id]`

Requiere autenticación.

### Actualizar Manga
**PUT** `/api/manga/list/[id]`

Requiere autenticación.

```json
{
  "status": "completed",
  "rating": 10,
  "chaptersRead": 100,
  "notes": "Actualizado"
}
```

### Eliminar Manga
**DELETE** `/api/manga/list/[id]`

Requiere autenticación.

---

## ⭐ Favoritos

### Agregar Anime a Favoritos
**POST** `/api/user/favorites/anime`

Requiere autenticación.

```json
{
  "animeId": "anime123"
}
```

### Eliminar Anime de Favoritos
**DELETE** `/api/user/favorites/anime?animeId=anime123`

Requiere autenticación.

### Agregar Manga a Favoritos
**POST** `/api/user/favorites/manga`

Requiere autenticación.

```json
{
  "mangaId": "manga123"
}
```

### Eliminar Manga de Favoritos
**DELETE** `/api/user/favorites/manga?mangaId=manga123`

Requiere autenticación.

---

## 🔒 Autenticación en las Peticiones

Para las peticiones autenticadas, NextAuth maneja las cookies automáticamente.

Si usas fetch desde el cliente:
```javascript
const response = await fetch('/api/anime/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    animeId: 'anime123',
    status: 'watching'
  })
});
```

---

## 📊 Códigos de Estado HTTP

- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Datos inválidos
- **401**: No autorizado (no logueado)
- **404**: Recurso no encontrado
- **500**: Error del servidor

---

## 🚀 Ejemplo de Uso Completo

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "otaku123",
    "email": "otaku@example.com",
    "password": "password123"
  }'
```

### 2. Login (usar la interfaz web o NextAuth)

### 3. Agregar Anime a Lista
```javascript
const addAnime = async () => {
  const response = await fetch('/api/anime/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      animeId: 'kaguya-sama',
      status: 'watching',
      rating: 9,
      episodesWatched: 8
    })
  });
  const data = await response.json();
  console.log(data);
};
```

### 4. Obtener Mi Lista de Anime
```javascript
const getMyAnimeList = async () => {
  const response = await fetch('/api/anime/list');
  const data = await response.json();
  console.log(data.animeList);
};
```

---

## 🗄️ Base de Datos MongoDB

### Colecciones:
- **users**: Usuarios del sistema
- **animelists**: Listas de anime de usuarios
- **mangalists**: Listas de manga de usuarios

### Conexión:
Configurada en `.env.local` con `MONGODB_URI`
