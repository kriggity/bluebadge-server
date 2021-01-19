module.exports = {
  NAME: process.env.APP_NAME || 'bluebadge',
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET
}
