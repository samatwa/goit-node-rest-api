import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: true,
  },
});

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}

export default sequelize;
