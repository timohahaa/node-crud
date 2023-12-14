# NodeJS CRUD-приложение
Стэк:
 - Node 20.10.0
 - ExpressJS
 - Typescript
 - TypeORM
 - pdfkit

### Запустить:
```bash
git clone https://github.com/timohahaa/node-crud
cd node-crud
docker-compose up
```
Запустится сервер по адресу `localhost:3000`

### API

1. POST /user/create
**Headers:**
 - Content-Type: application/json

**Request body:**
{
    "firstName": "имя пользователя",
    "lastName": "фамилия пользователя",
    "email": "example@mail.com",
    "password": "пароль",
    "imageData": "картинка в виде base64-encoded строки"
}

**Responce (success):**
{
    "token": "jwt токен для дальнейшей авторизации"
}

2. GET /user/read
**Headers:**
 - Content-Type: application/json
 - Authorization: Bearer *jwt-токен пользователя*

**Request body:**
{
    "email": "example@mail.com",
}

**Responce (success):**
{
    "firstName": "имя пользователя",
    "lastName": "фамилия пользователя",
    "email": "example@mail.com",
    "imageData": "картинка в виде base64-encoded строки"
}

3. PUT /user/update
**Headers:**
 - Content-Type: application/json
 - Authorization: Bearer *jwt-токен пользователя*

**Request body:**
{
    "firstName": "имя пользователя",     *<- необязательное поле*
    "lastName": "фамилия пользователя",     *<- необязательное поле*
    "email": "example@mail.com",     ***<- обязательное поле***
    "password": "пароль",     *<- необязательное поле*
    "imageData": "картинка в виде base64-encoded строки"     *<- необязательное поле*
}

**Responce (success):**
{
    "userId": "айди пользователя"
}

4. DELETE /user/delete
**Headers:**
 - Content-Type: application/json
 - Authorization: Bearer *jwt-токен пользователя*

**Request body:**
{
    "email": "example@mail.com"
}

**Responce (success):**
*пустое тело*

5. POST /user/pdf
**Headers:**
 - Content-Type: application/json
 - Authorization: Bearer *jwt-токен пользователя*

**Request body:**
{
    "email": "example@mail.com"
}

**Responce (success):**
{
    "exists": "true/false" *<- true если файл уже был создан, false если его еще не было создано и он создался только что*
}

6. POST /user/pdf
**Headers:**
 - Content-Type: application/json
 - Authorization: Bearer *jwt-токен пользователя*

**Request body:**
{
    "email": "example@mail.com"
}

**Responce (success):**
*пдф файл пользователя для просмотра в браузере*

(пример создавемого файла находится в репозитории - test.pdf)
