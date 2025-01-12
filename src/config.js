import 'dotenv/config'


const {
    PORT = 4000,
    DB_HOST = "localhost",
    DB_USER = "usuario",
    DB_PASS = "contrasena",
    DB_NAME = "dbname",
    DB_PORT = 3306,
    EMAIL_ACCOUNT = "email@adress.es",
    EMAIL_PASS = "your pass",
    NODE_DOCKER_PORT = 5002,
    MYSQL_LOCAL_PORT = 3307,
    MYSQL_DOCKER_PORT = 3306,
    GOOGLE_CLIENT_ID = "cliente id",
    GOOGLE_CLIENT_SECRET = "cliente google",
    GOOGLE_CALLBACK_URL = "http://localhost:4000/auth/google/callback",
    STRIPE_PRIV = "privatekey from stripe",
    STRIPE_WEBHOOK_SECRET_KEY = "secretkey from stripe",
    BASE_URL = "localhost"
  } = process.env;

const database = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT
};

export const config = {
  database,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT,
  EMAIL_ACCOUNT,
  EMAIL_PASS,
  NODE_DOCKER_PORT,
  MYSQL_LOCAL_PORT,
  MYSQL_DOCKER_PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  STRIPE_PRIV,
  STRIPE_WEBHOOK_SECRET_KEY,
  BASE_URL
};