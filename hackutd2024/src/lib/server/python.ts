"use server";

import { PinataSDK } from "pinata";

function getPinata() {
    return new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: "indigo-historical-bison-993.mypinata.cloud",
    });
}

export async function getAllFiles() {

    try {

    console.log("Getting all files");

    const pinata = getPinata();

    const files = await pinata.files.list().order("DESC").mimeType("application/json").limit(10);

    console.log(files);

    return files.files.filter((file) => file.name !== "latest.json");

    } catch (e) {
        console.log(e);
        return [];
    }

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

    try {
        const pinata = getPinata();

        const files = await pinata.files.list().name(name).limit(1)

        if (files.files.length === 0) {
            return null;
        }

        const file = await pinata.gateways.get(files.files[0].cid);

        return file;
    } catch (e) {
        console.log(e);
        return null;
    }

}

export async function getLiveTranscription() {

    try {
        const file = await getFileByName("latest.json")
        return file;
    } catch (e) {
        return null;
    }
}

export async function getLatestJSON() {
    const res = await fetch("http://localhost:8000/latest")
    return await res.json();
}