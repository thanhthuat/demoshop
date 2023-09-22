import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoose from "./dbs/init.mongodb.js";
import { checkOverLoad } from "./helpers/check.connect.js";
import router from "./routers/index.js";

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init db
mongoose;
// checkOverLoad();
// init db
// init routers
app.use("/", router);

// handling error 
app.use((error,req,res,next)=>{
  const statusCode = error.status ||500 ;
  return res.status(statusCode).json({
    status: 'error',
    code:statusCode,
    stack: error.stack,
    message:error.message || "Internal Server Error"
  })
  
})

export default app;
