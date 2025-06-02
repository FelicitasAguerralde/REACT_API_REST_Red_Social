# Documentación de la API REST de Red Social

## Autenticación

### Registro de Usuario
- **URL**: `/api/user/register`
- **Método**: `POST`
- **Descripción**: Registra un nuevo usuario en el sistema
- **Body**:
  ```json
  {
    "name": "string",
    "surname": "string",
    "nick": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Usuario registrado correctamente",
    "user": {
      "id": "string",
      "name": "string",
      "surname": "string",
      "nick": "string",
      "email": "string",
      "createdAt": "date"
    }
  }
  ```

### Login
- **URL**: `/api/user/login`
- **Método**: `POST`
- **Descripción**: Autentica a un usuario y devuelve un token JWT
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Te has logueado correctamente",
    "user": {
      "name": "string",
      "surname": "string"
    },
    "token": "string"
  }
  ```

### Verificar Autenticación
- **URL**: `/api/user/auth`
- **Método**: `GET`
- **Descripción**: Verifica si el token de autenticación es válido
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Autenticación exitosa",
    "user": {
      "id": "string",
      "name": "string",
      "surname": "string",
      "nick": "string",
      "email": "string",
      "image": "string"
    }
  }
  ```

## Usuarios

### Obtener Perfil
- **URL**: `/api/user/profile/:id`
- **Método**: `GET`
- **Descripción**: Obtiene el perfil de un usuario específico
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "user": {
      "id": "string",
      "name": "string",
      "surname": "string",
      "nick": "string",
      "email": "string",
      "image": "string",
      "createdAt": "date"
    }
  }
  ```

### Listar Usuarios
- **URL**: `/api/users`
- **Método**: `GET`
- **Descripción**: Lista todos los usuarios
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "users": [
      {
        "id": "string",
        "name": "string",
        "surname": "string",
        "nick": "string",
        "image": "string"
      }
    ],
    "page": "number",
    "itemsPerPage": "number",
    "total": "number",
    "pages": "number"
  }
  ```

### Listar Usuarios con Paginación
- **URL**: `/api/users/:page`
- **Método**: `GET`
- **Descripción**: Lista usuarios con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Usuarios

### Actualizar Usuario
- **URL**: `/api/user/update`
- **Método**: `PUT`
- **Descripción**: Actualiza los datos del usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "string",
    "surname": "string",
    "nick": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Usuario actualizado correctamente",
    "user": {
      "id": "string",
      "name": "string",
      "surname": "string",
      "nick": "string",
      "email": "string",
      "image": "string"
    }
  }
  ```

### Subir Avatar
- **URL**: `/api/user/upload`
- **Método**: `POST`
- **Descripción**: Sube una imagen de perfil
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body**: 
  - `file0`: Archivo de imagen (campo obligatorio)
- **Límites**:
  - Tamaño máximo: 5MB
  - Formatos permitidos: jpg, jpeg, png, gif
- **Ejemplo de uso en Frontend**:
  ```javascript
  // Crear FormData y agregar el archivo
  const formData = new FormData();
  formData.append('file0', archivoImagen);

  // Realizar la petición
  fetch('http://tu-api/api/user/upload', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token
      },
      body: formData
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Imagen subida correctamente",
    "user": {
      "id": "string",
      "name": "string",
      "surname": "string",
      "nick": "string",
      "email": "string",
      "image": "string"
    },
    "file": {
      "filename": "string",
      "path": "string",
      "size": "number"
    }
  }
  ```
- **Respuesta Error**:
  ```json
  {
    "status": "error",
    "message": "Mensaje de error específico"
  }
  ```

### Obtener Avatar
- **URL**: `/api/user/avatar/:file`
- **Método**: `GET`
- **Descripción**: Obtiene la imagen de perfil de un usuario
- **Respuesta**: Archivo de imagen

### Eliminar Usuario
- **URL**: `/api/user/delete/:id`
- **Método**: `DELETE`
- **Descripción**: Elimina un usuario y sus follows relacionados
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Usuario eliminado correctamente",
    "user": {
      "id": "string",
      "name": "string",
      "surname": "string",
      "nick": "string",
      "email": "string"
    }
  }
  ```

## Seguimiento

### Seguir Usuario
- **URL**: `/api/follow/save`
- **Método**: `POST`
- **Descripción**: Seguir a un usuario
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "followed": "string"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Usuario seguido correctamente",
    "follow": {
      "id": "string",
      "user": "string",
      "followed": "string",
      "createdAt": "date"
    }
  }
  ```

### Dejar de Seguir
- **URL**: `/api/follow/delete/:id`
- **Método**: `DELETE`
- **Descripción**: Dejar de seguir a un usuario
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Has dejado de seguir a este usuario",
    "followDeleted": {
      "id": "string",
      "user": "string",
      "followed": "string"
    }
  }
  ```

### Listar Seguidos
- **URL**: `/api/follow/following`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que sigue el usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Listado de usuarios que sigues",
    "follows": [
      {
        "id": "string",
        "user": {
          "id": "string",
          "name": "string",
          "surname": "string",
          "nick": "string",
          "image": "string"
        }
      }
    ]
  }
  ```

### Listar Seguidos de un Usuario
- **URL**: `/api/follow/following/:id`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que sigue un usuario específico
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Seguidos

### Listar Seguidos de un Usuario con Paginación
- **URL**: `/api/follow/following/:id/:page`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que sigue un usuario específico con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Seguidos

### Listar Seguidores
- **URL**: `/api/follow/followers`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que siguen al usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Listado de usuarios que te siguen",
    "follows": [
      {
        "id": "string",
        "user": {
          "id": "string",
          "name": "string",
          "surname": "string",
          "nick": "string",
          "image": "string"
        }
      }
    ]
  }
  ```

### Listar Seguidores de un Usuario
- **URL**: `/api/follow/followers/:id`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que siguen a un usuario específico
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Seguidores

### Listar Seguidores de un Usuario con Paginación
- **URL**: `/api/follow/followers/:id/:page`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que siguen a un usuario específico con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Seguidores

## Publicaciones

### Guardar Publicación
- **URL**: `/api/publication/save`
- **Método**: `POST`
- **Descripción**: Crea una nueva publicación
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "text": "string",
    "file": "string (opcional)"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Publicación guardada correctamente",
    "publication": {
      "id": "string",
      "user": "string",
      "text": "string",
      "file": "string",
      "createdAt": "date"
    }
  }
  ```

### Eliminar Publicación
- **URL**: `/api/publication/delete/:id`
- **Método**: `DELETE`
- **Descripción**: Elimina una publicación específica
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Publicación eliminada correctamente",
    "publication": {
      "id": "string",
      "user": "string",
      "text": "string",
      "file": "string",
      "createdAt": "date"
    }
  }
  ```

### Obtener Publicación
- **URL**: `/api/publication/:id`
- **Método**: `GET`
- **Descripción**: Obtiene una publicación específica
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "publication": {
      "id": "string",
      "user": {
        "id": "string",
        "name": "string",
        "surname": "string",
        "nick": "string",
        "image": "string"
      },
      "text": "string",
      "file": "string",
      "createdAt": "date"
    }
  }
  ```

### Listar Publicaciones
- **URL**: `/api/publications/:page?`
- **Método**: `GET`
- **Descripción**: Lista todas las publicaciones con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "publications": [
      {
        "id": "string",
        "user": {
          "id": "string",
          "name": "string",
          "surname": "string",
          "nick": "string",
          "image": "string"
        },
        "text": "string",
        "file": "string",
        "createdAt": "date"
      }
    ],
    "page": "number",
    "itemsPerPage": "number",
    "total": "number",
    "pages": "number"
  }
  ```

### Listar Publicaciones de Usuario
- **URL**: `/api/publications-user/:id/:page?`
- **Método**: `GET`
- **Descripción**: Lista las publicaciones de un usuario específico con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Publicaciones

#### Actualizar imagen de publicación
- **URL**: `/api/publication/upload/:id`
- **Método**: `POST`
- **Headers**:
  - `Authorization`: `Bearer <token>`
  - `Content-Type`: `multipart/form-data`
- **Parámetros URL**:
  - `id`: ID de la publicación a actualizar
- **Body**:
  - `file0`: Archivo de imagen (png, jpg, jpeg, gif)
- **Respuesta exitosa**:
  ```json
  {
    "status": "success",
    "message": "Imagen actualizada correctamente",
    "publication": {
      "user": "id_usuario",
      "text": "texto de la publicación",
      "file": "nombre_archivo",
      "_id": "id_publicacion",
      "created_at": "fecha_creacion"
    },
    "file": {
      "fieldname": "file0",
      "originalname": "nombre_original",
      "encoding": "7bit",
      "mimetype": "tipo_mime",
      "destination": "ruta_destino",
      "filename": "nombre_archivo",
      "path": "ruta_completa",
      "size": "tamaño_bytes"
    }
  }
  ```

## Códigos de Error

- **400**: Error de validación o datos incorrectos
- **401**: No autenticado
- **403**: No autorizado
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: usuario ya existe)
- **500**: Error interno del servidor

## Formato de Respuesta de Error

```json
{
  "status": "error",
  "message": "string",
  "errors": [
    {
      "msg": "string",
      "param": "string",
      "location": "string"
    }
  ]
}
``` 