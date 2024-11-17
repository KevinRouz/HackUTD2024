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

    const files = await pinata.files.list().order("DESC").mimeType("application/json")

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

export async function getFileByName(name: string) {

    const pinata = getPinata();

    const files = await pinata.files.list().name(name).limit(1)

    const file = await pinata.gateways.get(files.files[0].cid);

    return file;

}