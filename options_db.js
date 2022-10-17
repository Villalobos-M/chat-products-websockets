const optionsMariaDB = {
   client: "mysql",
   connection: {
      host: "127.0.0.1",
      user: "root",
      password: "pass1234",
      database: "products",
   },
};

const optionsSqlite = {
   client: "sqlite3",
   connection: { filename: "./db/ecommerce.sqlite" },
   useNullAsDefault: true,
};

module.exports = { optionsMariaDB, optionsSqlite };