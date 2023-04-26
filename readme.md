# Простой пример хорошего backend на express js с авторизацией + mongo db

1. Установить Mongo DB
2. Установить MongoDB Compass
3. Зайти в файл environment.js находящийся в папке environments, выбрать одну из строк 1 или 2, если выбрали 1 то 2 оставить закоментированной как там и есть по умолчанию. Это значит что у вас подключен environment для разработки, если закоментировать 1 строку, а раскоментировать 2 строку, то будет значить что у вас подключен environment для прода.
4. Настроить оба environments соответствующим образом: установить порт, access и refresh ключи, url и название базы данных mongoDB
5. При первом запуске в файле index.js раскоментировать строки 7, 33 и 34. Это создаст две роли по умолчанию (админ и пользователь) при первом запуске.
6. закоментировать строки указанные в пункте 5.
7. Создать соответствующие эндпоинты в Postman, Insomnia, другом rest api клиенте для тестирования.
8. Радоваться жизни.

## Все endpoints

1. Создать пользователя
   POST - http://url:port/api/auth/register
   BODY JSON: {
   "username": "<string логина>",
   "password": "<string пароля>"
   }
   headers: {
   Content-Type: application/json
   }

2. Авторизация пользователя
   POST - http://url:port/api/auth/login
   BODY JSON: {
   "username": "<string логина>",
   "password": "<string пароля>"
   }
   headers: {
   Content-Type: application/json
   }

3. Выход пользователя
   POST - http://url:port/api/auth/logout
   BODY NO

4. Обновить access & refresh токены (refresh пропишется в httpOnly)
   GET - http://url:port/api/auth/refresh-tokens
   BODY NO

5. Получить всех пользователей
   GET - http://url:port/api/users
   BODY NO
   headers: {
   Authorization: Bearer + ${access}
   }

### Внимание, access токен живет 15 секунд. Изменить это можно в tokens.service.js на 15 строке

### Внимание, эндпоинт получения всех пользователей доступен только для роли администратора. Изменить это можно в файле users.controller.js на 12 строке передав в middleware под названием roleMiddleware роль user или другую созданную вами роль
