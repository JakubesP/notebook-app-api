# Notebook app API

Very simple API created to learn express framework and backend interaction with AWS S3. The application uses a session authentication system using Redis.

The project uses:
- Express
- MongoDB
- Redis
- Docker

## Installation and running

```sh
git clone https://github.com/JakubesP/notebook-app-api
cd notebook-app-api
```
#### env files
In the `notebook-app-api` directory, create a `3rd-services.env` file. It should take the following form:
```sh
# mongo
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=secret
MONGO_INITDB_DATABASE=notebook
MONGO_USERNAME=admin
MONGO_PASSWORD=secret

# redis
REDIS_PASSWORD=secret
```
Create also `app.env` file inside the same direcotry. It should take the following form:
```sh
PORT=3000
NODE_ENV=development

MONGO_USERNAME=admin
MONGO_PASSWORD=secret
MONGO_HOST=db
MONGO_PORT=27017
MONGO_DATABASE=notebook

REDIS_PORT=6379,
REDIS_HOST=cache
REDIS_PASSWORD=secret

UPLOADS_STORAGE=aws 
# or local (then you need to create uploads dir in api folder)

UPLOAD_BYTES_LIMIT=2000000

SESSION_SECRET=secret
RESET_PASSWORD_SECRET=secret
SESSION_NAME=sid

EMAIL_USERNAME=...
EMAIL_PASSWORD=...
EMAIL_HOST=...
EMAIL_PORT=...

AWS_ID=...
AWS_SECRET=...
AWS_BUCKET_NAME=...
```

then run:
```sh
npm run up
```
