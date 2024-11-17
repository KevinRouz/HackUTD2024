"use server";

import { PinataSDK } from "pinata";



export async function getAllFiles() {

    const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: "indigo-historical-bison-993.mypinata.cloud",
    });

    const files = await pinata.files.list();

    console.log(files);

    //   return fs.readdirSync(path.join(__dirname, 'python'));
}