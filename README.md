# Task Assessment – NestJS API

Simple REST API built with NestJS, TypeORM and JWT Authentication.

This project supports:
- User registration
- User login
- Task CRUD (only logged-in user tasks)
- Postman collection included

--------------------------------------------------

## Features

Authentication
- Register
- Login (JWT based)

Tasks
- Create task
- List own tasks
- Update own task
- Delete own task

All task APIs are protected using JWT.

--------------------------------------------------

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- JWT Authentication
- class-validator

--------------------------------------------------

## Project Setup

npm install

--------------------------------------------------

## Run Project

npm run start:dev

Server runs on:

http://localhost:3000

--------------------------------------------------

## API Endpoints

## Auth

Register

POST /auth/register

Request Body

{
  "email": "test@example.com",
  "password": "123456"
}

--------------------------------------------------

Login

POST /auth/login

Request Body

{
  "email": "test@example.com",
  "password": "123456"
}

Response

{
  "access_token": "JWT_TOKEN"
}

--------------------------------------------------

## Tasks (JWT required)

Header

Authorization: Bearer <access_token>

--------------------------------------------------

Create task

POST /tasks

Request Body

{
  "title": "My task",
  "description": "My description"
}

--------------------------------------------------

Get my tasks

GET /tasks

Optional query params

?page=1&limit=10&status=pending

--------------------------------------------------

Update task

PATCH /tasks/{id}

Request Body

{
  "title": "Updated title",
  "description": "Updated description"
}

--------------------------------------------------

Delete task

DELETE /tasks/{id}

--------------------------------------------------

## Authorization rule

- A user can update only his own tasks
- A user can delete only his own tasks
- If a task does not belong to the logged-in user, API returns 403 Forbidden

--------------------------------------------------

## Postman Collection

Postman collection file is included in this repository.

File name:

task_management.postman_collection.json

Import this file in Postman to test all APIs.

The collection contains:
- Register API
- Login API
- Task CRUD APIs
- Collection variable for token and url

--------------------------------------------------

## Environment variables

Create a .env file

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=task_db

--------------------------------------------------

## Notes

- JWT payload contains user id in sub
- Logged-in user is resolved using @CurrentUser() decorator
- Each task is linked using user_id column
