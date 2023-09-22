import mongoose from "mongoose";
import app from "./src/app.js";

const PORT = 3055;
const server = app.listen(PORT, () => {
  console.log(` app run on port ${PORT}`);
});


process.on('SIGINT',()=>{
    server.close(()=> console.log(`Exit server`))
    mongoose.disconnect()
})


