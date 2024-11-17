"use server";

import { PinataSDK } from "pinata";

function getPinata() {
    return new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: "indigo-historical-bison-993.mypinata.cloud",
    });
}

export async function getAllFiles() {

    console.log("Getting all files");

    const pinata = getPinata();

    const files = await pinata.files.list().order("DESC");

    console.log(files);

    return files;

    //   return fs.readdirSync(path.join(__dirname, 'python'));
}

export async function getFile(id: string) {
    
    console.log("Getting file with id: " + id);

    const pinata = getPinata();

    const file = await pinata.gateways.get(id);

    console.log(file);

    return file;
}