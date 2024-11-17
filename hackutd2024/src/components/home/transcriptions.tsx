"use client";

import { getAllFiles } from "@/lib/server/python";
import { useEffect } from "react";

export default function Transcriptions() {

    useEffect(() => {
        getAllFiles();
    }, []);

    return (
        <div className="w-full">
            
        </div>
    );
}