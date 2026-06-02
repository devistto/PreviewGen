import { GiConfirmed } from "react-icons/gi";
import { FaRepeat } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import { useEffect, useState, type ChangeEvent } from "react";
import { FaRegFileVideo } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { MdLocalMovies } from "react-icons/md";
import { AiFillFileText } from "react-icons/ai";
import { filesize } from "filesize"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type FileTye = {
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    imageFile: string | null
    setImageFile: React.Dispatch<React.SetStateAction<string | null>>
    loading: boolean
}

export const UploadComponent = ({ setFile, imageFile, setImageFile, loading }: FileTye) => {
    const [videoUrl, setVideoUrl] = useState("");
    const [metdata, setMetadata] = useState({
        name: "desconhecido",
        size: "desconhecido",
        resolution: "desconhecido",
        duration: "desconhecido",
        format: "desconhecido"
    })

    const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

        setVideoUrl(url);
        setFile(file)

        setMetadata((prev) => ({
            ...prev,
            name: file.name,
            size: filesize(file.size)
        }));

        const video = document.createElement("video");

        video.preload = "metadata";

        video.onloadedmetadata = () => {
            const duration = new Date(video.duration * 1000)
                .toISOString()
                .slice(11, 19)

            setMetadata((prev) => ({
                ...prev,
                duration,
                resolution: `${video.videoHeight}x${video.videoWidth}`
            }));
        };

        video.src = url;
    };
    const handleDownload = () => {
        if (!imageFile) return;

        const a = document.createElement("a");
        a.href = imageFile;
        a.download = "preview.png";

        a.click();
    };

    useEffect(() => {
        return () => {
            if (imageFile) {
                URL.revokeObjectURL(imageFile);
            }
        };
    }, [imageFile]);

    return (
        <div className="bg-zinc-800/70 w-full h-full px-5 py-2 rounded-md flex flex-col text-white border border-zinc-700/30 relative">

            {
                <div className={`${loading || imageFile ? "visible" : "invisible"} absolute inset-0 z-20 flex flex-col items-center justify-center
                        bg-black/40 backdrop-blur-md`}>
                    {
                        loading ? <div>
                            <div className="flex flex-col items-center">
                                <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-3" />
                                <p>Por favor, aguarde</p>
                            </div>
                        </div>
                            : imageFile ? (
                                <>
                                    <div className="relative">

                                        <div className="absolute -inset-4 bg-blue-500/20 blur-3xl" />

                                        <img
                                            src={imageFile}
                                            className="relative max-w-[85%] max-h-[75vh] mx-auto
                               object-contain
                               border border-zinc-600/50
                               shadow-[0_0_60px_rgba(0,0,0,0.7)]"
                                        />

                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={handleDownload}
                                            className="px-8 py-3 rounded-lg
                               bg-blue-600 hover:bg-blue-500
                               transition font-medium shadow-lg"
                                        >
                                            Salvar
                                        </button>

                                        <button
                                            onClick={() => setImageFile(null)}
                                            className="px-8 py-3 rounded-lg
                               bg-zinc-700 hover:bg-zinc-600
                               transition font-medium"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </>
                            ) : null
                    }
                </div>
            }

            <header className="flex justify-between items-start h-12 w-full">
                <div className="flex gap-x-3 items-center px-3 py-1">
                    <h1>{videoUrl ? "Uploaded" : "Upload Video"}</h1>
                    <GiConfirmed className={`text-lg ${videoUrl ? "text-green-800" : "text-zinc-700"}`} />
                </div>

                {
                    videoUrl ? <div className="flex gap-x-3 items-center px-3 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/40 relative">
                        <FaRepeat className="text-lg text-white rotate-15" />
                        <h1>Change</h1>
                        <input type="file" accept="video/*" onChange={handleVideo} className="absolute w-full opacity-0 left-1 h-full" />
                    </div> : <div></div>
                }
            </header>

            <div className="w-full h-[640px] mt-3 relative">
                <div className="relative w-full h-full bg-zinc-800/30 flex items-center justify-center flex-col relative border border-zinc-700/40">
                    {
                        videoUrl ? <video
                            src={videoUrl}
                            controls
                            className="absolute inset-0 w-full h-full object-contain rounded-md"
                        ></video> : <div className="w-full h-full flex justify-center items-center flex-col hover:bg-zinc-800/60">
                            <MdOutlineFileUpload className="text-zinc-400 text-7xl mb-3" />
                            <p className="text-zinc-500">Arraste e solte um video aqui ou cloque para procurar</p>
                            <p className="text-zinc-500">Aceita a maioria dos formatos conhecidos</p>
                            <p className="text-zinc-500">Tamanho ilimitado</p>
                            <input type="file" accept="video/*"
                                onChange={handleVideo} className="absolute w-full h-full opacity-0" />
                        </div>
                    }
                </div>

            </div>

            <div className="w-full h-28 flex justify-between gap-x-1 mt-5">
                <div className="w-full h-full bg-zinc-800/30 border border-zinc-700/40 flex justify-start px-6 items-center gap-x-3">
                    <FaRegFileVideo className="text-4xl bg-zinc-700/70 text-zinc-500 p-2 rounded-md" />
                    <div className="flex flex-col">
                        <h1>{metdata.name.length > 31 ? metdata.name.slice(0, 31) + "..." : metdata.name}</h1>
                        <p className="text-zinc-500">Nome do arquivo</p>
                    </div>
                </div>

                <div className="w-full h-full bg-zinc-800/30 border border-zinc-700/40 flex justify-center items-center gap-x-3 justify-start px-6">
                    <IoTime className="text-4xl bg-zinc-700/70 text-zinc-500 p-2 rounded-md" />
                    <div className="flex flex-col">
                        <h1>{metdata.duration}</h1>
                        <p className="text-zinc-500">Duração de video</p>
                    </div>
                </div>

                <div className="w-full h-full bg-zinc-800/30 border border-zinc-700/40 flex justify-center items-center gap-x-3 justify-start px-6">
                    <MdLocalMovies className="text-4xl bg-zinc-700/70 text-zinc-500 p-2 rounded-md" />
                    <div className="flex flex-col">
                        <h1>{metdata.resolution}</h1>
                        <p className="text-zinc-500">Resolução de imagem</p>
                    </div>
                </div>

                <div className="w-full h-full bg-zinc-800/30 border border-zinc-700/40 flex justify-center items-center gap-x-3 justify-start px-6">
                    <AiFillFileText className="text-4xl bg-zinc-700/70 text-zinc-500 p-2 rounded-md" />
                    <div className="flex flex-col">
                        <h1>{metdata.size}</h1>
                        <p className="text-zinc-500">Tamanho do arquivo</p>
                    </div>
                </div>
            </div>

        </div >
    )
}