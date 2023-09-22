import mongoose from "mongoose";
import os from 'os';
import process from "process";
const _SECONDS = 5000 ;
// check count connect 
const countConnect = () =>{
    const numberConnect = mongoose.connections.length 
    console.log(`Number connect ${numberConnect}`)
}

// check over load 
export const checkOverLoad = () =>{
    setInterval(()=>{
        const numberConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss ;
        const maxConnections = numCores*5 ;
        console.log(`Memory usage : ${memoryUsage/1024/1024} MB`)
        if (numberConnection > maxConnections){
            console.log("Connect over load ")
        }

    },_SECONDS) // Monitor every 5 seconds
}

export default countConnect