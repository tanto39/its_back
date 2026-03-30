Установка:
1) git clone https://github.com/tanto39/its_back.git
2) npm install

3) Установить базу данных PostgreSQL если ее нет: https://www.postgresql.org/download/

В утилите SQL Shell выполнить команду по созданию БД its_auto:
CREATE DATABASE "its_auto"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

либо создать БД its_auto вручную в pgadmin.

Выполнить скрипт для создания таблиц tables.sql в pgadmin (через query tool) либо в sql shell. 
Начальный логин/пароль администратора: admin_01 Pa$$w0rd1


Запуск в продуктовом режиме:
npm run start

Запуск в режиме dev:
npm run dev