## API-REST para Red Social
API REST con Node, Mongo, Express, JWT para una red social
1. Iniciar el proyecto: **npm init** (entry point: index.js)
Antes comprobar que se tiene instalado node **node --version** y MongoDB
2. Instalar dependencias y librerías
- Express: **npm install express**
- Mongoose: **npm install mongoose**
- Mongose pagination v2: **npm install mongoose-pagination-v2**
- Multer: **npm install multer**
- Moment: **npm install moment**
- Validator: **npm install validator**
- BCrypt: **npm install bcrypt**
- JWT-simple: **npm install jwt-simple**
- Cors: **npm install cors**

3. Agregar en el archivo package.json: en "script", "start": "nodemon index.js"

4. Crear el archivo startProject que permite ejecutar el proyecto y la base en paralelo

start cmd.exe /k "cd C:\Archivos de programa\MongoDB\Server\8.0\bin && mongod.exe --dbpath C:/data5/db"

start cmd.exe /k "cd C:\Users\Usuario\Documents\0000 React\API-REST-RedSocial && npm start"

5. Crear la coneción a la base

6. Crear los controladores y las rutas

### Importante:
La versión más reciente de Mongoose no acepta callbacks. Usar async/await, que es la forma más moderna y recomendada.