"use client";

import { getAllFiles, getFile } from "@/lib/server/python";
import { FileIcon } from "lucide-react";
import { FileListResponse } from "pinata";
import { useEffect, useState } from "react";

export default function Transcriptions() {

    const [files, setFiles] = useState<FileListResponse | null>(null);

    const [currentFileID, setCurrentFile] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            setFiles(await getAllFiles());
        };
        fetchFiles();
        return () => {
            setFiles(null);
        };
    }, []);

    const onFileSelection = (fileID: string) => {
        setCurrentFile(fileID);
        const file = getFile(fileID);
    }

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <div className="py-12 text-3xl">
                <b>
                    KnowNonsense
                </b>
            </div>
            {files ? files.files.map((file) => (
                <div
                    onClick={() => onFileSelection(file.id)}
                    key={file.id}
                    className="w-full max-w-[800px] bg-blend-saturation rounded-lg border border-primary/20 p-2 flex flex-row justify-start items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
                    <FileIcon size="16" />
                    <h2 className="text-lg">{file.name}</h2>
                </div>
            )) : (
                <p>Loading...</p>
            )}
        </div>
    );
}