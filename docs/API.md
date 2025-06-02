# Documentación de la API REST de Red Social

## Autenticación

### Registro de Usuario
- **URL**: `/api/register`
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
- **URL**: `/api/login`
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
- **URL**: `/api/auth`
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
- **URL**: `/api/users/profile/:id`
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
- **URL**: `/api/list`
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
- **URL**: `/api/users/list/:page`
- **Método**: `GET`
- **Descripción**: Lista usuarios con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Usuarios

### Actualizar Usuario
- **URL**: `/api/users/update`
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
- **URL**: `/api/upload`
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
  fetch('http://tu-api/api/users/upload', {
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
- **URL**: `/api/avatar/:file`
- **Método**: `GET`
- **Descripción**: Obtiene la imagen de perfil de un usuario
- **Respuesta**: Archivo de imagen

### Eliminar Usuario
- **URL**: `/api/delete/:id`
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
- **URL**: `/api/saveFollow`
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
- **URL**: `/api/unfollow/:id`
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
- **URL**: `/api/following`
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
- **URL**: `/api/following/:id`
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
- **URL**: `/api/followers`
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
- **URL**: `/api/followers/:id`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que siguen a un usuario específico
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Seguidores

### Listar Seguidores de un Usuario con Paginación
- **URL**: `/api/followers/:id/:page`
- **Método**: `GET`
- **Descripción**: Lista los usuarios que siguen a un usuario específico con paginación
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa**: Igual que Listar Seguidores

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