"use client";

import { getAllFiles, getFile, getFileByName } from "@/lib/server/python";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { FileListItem, FileListResponse, GetCIDResponse } from "pinata";
import { useEffect, useState } from "react";

type Source = {
    title: string;
    url: string;
    publisher: string;
    rating: string;
}

type Message = {
    text: string;
    user: string;
    sources: Source[];
}

type Transcript = {
    id: number;
    messages: Message[];
}

export default function Transcriptions() {

    const [files, setFiles] = useState<FileListResponse | null>(null);

    const [currentFile, setCurrentFile] = useState<FileListItem | null>(null);
    const [currentFileURL, setCurrentFileURL] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<Transcript | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            setFiles(await getAllFiles());
        };
        let int = setInterval(fetchFiles, 5000);
        return () => {
            setFiles(null);
            clearInterval(int);
        };
    }, []);

    const onFileSelection = async (_file: FileListItem) => {

        setCurrentFile(null);
        setCurrentFileURL(null);
        setTranscript(null);

        if (currentFile?.cid === _file.cid) {

            return;
        }

        setCurrentFile(_file);
        const file = await getFile(_file.cid) as GetCIDResponse;
        console.log(file);

        const transcript = file.data as unknown as Transcript;
        console.log(transcript);

        setTranscript(transcript);

        // download file pdf
        const blob = new Blob([file.data! as Blob], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "test.pdf"
        // a.click();

        setCurrentFileURL(url);

    }

    const downloadFile = async () => {
        if (currentFile?.name) {
            const file = await getFileByName(currentFile.name.replaceAll(".json", ".pdf"));

            // download the pdf
            const blob = new Blob([file.data! as Blob], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "test.pdf"
            a.click()
        }
    }

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <div className="py-12 text-3xl">
                <b>
                    KnowNonsense
                </b>
            </div>
            <p className="text-base mb-1">
                Real time fact checking pushing the conversation forward.
            </p>
            {files ? files.files.map((file) => (
                <div
                    key={file.id}
                    className="animate-fade-in-up w-full flex flex-col justify-start items-start max-w-[800px] bg-primary/5 rounded-lg border border-primary/20 p-2 gap-2 max-h-[80vh] overflow-y-auto">
                    <div onClick={() => onFileSelection(file)} className="flex cursor-pointer flex-row w-full gap-2 justify-start items-center opacity-100 hover:opacity-80 transition-opacity">
                        <FileIcon size="16" />
                        <h2 className="text-lg">{file.keyvalues.title}</h2>
                    </div>
                    {/* {file.cid === currentFile?.cid && currentFileURL && <iframe src={currentFileURL} className="w-full h-96 animate-max-height" />} */}

                    {file.cid === currentFile?.cid && transcript && (
                        <div className="w-full mt-10 relative flex flex-col justify-start items-start gap-8 animate-max-height overflow-hidden">
                            {transcript.messages.map((message) => (
                                <div key={message.user} className={cn("w-max max-w-[80%] flex flex-col justify-center items-start p-1.5 h-max border rounded-lg bg-primary/10 text-primary/85", message.user === "Fact Check" ? "self-center" : message.user === "me" ? "self-end bg-primary/90 text-secondary/85" : "self-start")}>
                                    <div className="relative w-full text-wrap flex flex-row justify-start items-center">
                                        <p className="text-lg h-full text-wrap w-full">{message.text}</p>
                                        {message.user !== "Fact Check" && (
                                            <p className={cn("text-sm text-wrap opacity-50 absolute -bottom-full", message.user === "me" ? "right-0 text-primary" : "left-0")}>{message.user}</p>
                                        )}
                                    </div>
                                    {message.sources.length > 0 && <div className="w-max max-w-[600px] flex flex-col justify-start items-start gap-2 pt-4">
                                        {message.sources.map((source) => (
                                            <div key={source.url} className="w-full flex flex-col justify-start items-start gap-2 text-ellipsis">
                                                <a href={source.url} target="_blank" className="text-xs underline ">{source.url}</a>
                                                {/* <p className="text-lg">{source.publisher}</p>
                                                <p className="text-lg">{source.rating}</p> */}
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                            ))}

                            <div 
                            onClick={downloadFile}
                            className="w-full flex flex-row justify-center items-center text-sm mb-4 animate-pulse cursor-pointer">
                                download pdf
                            </div>
                        </div>
                    )}
                </div>
            )) : (
                <p>Loading...</p>
            )}
        </div>
    );
}