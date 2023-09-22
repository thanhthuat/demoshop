const PRO = {
  app: {
    port: process.env.DEV_APP_PORT || 3033,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEB_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "shopDEV",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3033,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "shopDEV",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
export default config[env];
