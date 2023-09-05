require("dotenv/config");

const {env} = process;

module.exports = {
  port: env.PORT,
  jwt_secret_key: env.JWT_SECRET_KEY,
  exp_token: env.EXP_TOKEN,
  db_url: env.DB_URL,
};
