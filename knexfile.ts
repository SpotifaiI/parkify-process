module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ?? '3306',
      user: "root",
      password: process.env.DB_PASS
    },
    migrations: {
      directory: "./migrations"
    }
  },
  tests: {
    client: 'sqlite3',
    connection: {
      filename: './mydb.sqlite',
    },
    migrations: {
      directory: "./migrations"
    },
    useNullAsDefault: true
  }
};
