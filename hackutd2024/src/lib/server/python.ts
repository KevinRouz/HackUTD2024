"use server";

import { PinataSDK } from "pinata";



export function getAllFiles() {

    const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: "indigo-historical-bison-993.mypinata.cloud",
    });

    //   return fs.readdirSync(path.join(__dirname, 'python'));
}