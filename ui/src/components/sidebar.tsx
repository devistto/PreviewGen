import { useState } from "react";
import { CustomDropdown } from "./dropdown"
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { MdOutlineFileDownload } from "react-icons/md";

export type FieldNameType = "grid" | "spacing" | "ratio" | "backgroundColor" | "textColor" | "font" | "timestamps" | "metadata" | "outputFormat" | "quality";

type FunctionType = {
    submitForm: (data: any) => void;
    video: File | null
}

export const SideBarCompoent = ({ submitForm, video }: FunctionType) => {
    const [settings, setSettings] = useState({
        grid: "2x2",
        spacing: 2,
        ratio: "16:9",
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        font: "Inter",
        timestamps: true,
        metadata: true,
        outputFormat: "png",
        quality: 70
    });

    const updateSetting = (key: FieldNameType, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <div className="bg-zinc-800/70 w-[450px] h-full p-5 rounded-md flex flex-col text-white border border-zinc-800/80">

            <div>
                <h1 className="text-xl flex"><p className="text-blue-200">1</p>. Configurações de quadros</h1>
                <p></p>

                <div className="flex gap-x-7 justify-center mt-5 mb-3">
                    <div className="w-full flex flex-col">
                        <h2 className="mb-2">Esquema</h2>
                        <CustomDropdown data={[
                            { fieldText: "2x2 - 4 quadros", fieldValue: "2x2", fieldName: "grid" },
                            { fieldText: "3x3 - 9 quadros", fieldValue: "3x3", fieldName: "grid" },
                            { fieldText: "4x4 - 16 quadros", fieldValue: "4x4", fieldName: "grid" },
                            { fieldText: "5x5 - 25 quadros", fieldValue: "5x5", fieldName: "grid" }
                        ]} defineValue={updateSetting} />
                    </div>

                    <div className="w-full flex flex-col justify-between">
                        <h2 className="">Espaçamento</h2>
                        <div className="flex gap-x-3 items-center">
                            <input type="range" min="0" max="10" step="2"
                                value={settings.spacing}
                                onChange={(e) => updateSetting("spacing", Number(e.target.value))}
                                className="w-full"
                            />
                            <p className="px-3 w-20 flex justify-center py-1 text-xs border border-zinc-800">{settings.spacing} <span className="text-zinc-500 ml-2">px</span></p>
                        </div>
                    </div>
                </div>

                <h3 className="mt-2 mb-3">Proporção</h3>
                <div className="flex justify-between w-full gap-x-2">

                    <div className={`flex border border-zinc-800 py-1 px-6 items-center justify-center gap-x-2 ${settings.ratio === "9:16" ? "bg-zinc-800/80" : ""}`}
                        onClick={() => updateSetting("ratio", "9:16")}
                    >
                        <p>9:16</p>
                    </div>

                    <div className={`flex border border-zinc-800 py-1 px-6 items-center justify-center gap-x-2 ${settings.ratio === "16:9" ? "bg-zinc-800/80" : ""}`}
                        onClick={() => updateSetting("ratio", "16:9")}
                    >
                        <FaYoutube className="text-red-700" />
                        <p className="">16:9</p>
                    </div>

                    <div className={`flex border border-zinc-800 py-1 px-6 items-center justify-center gap-x-2 ${settings.ratio === "4:3" ? "bg-zinc-800/80" : ""}`}
                        onClick={() => updateSetting("ratio", "4:3")}
                    >
                        <FaTiktok />
                        <p className="">4:3</p>
                    </div>

                    <div className={`flex border border-zinc-800 py-1 px-6 items-center justify-center gap-x-2 ${settings.ratio === "1:1" ? "bg-zinc-800/80" : ""}`}
                        onClick={() => updateSetting("ratio", "1:1")}
                    >
                        <GrInstagram className="text-pink-300" />
                        <p>1:1</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-[2px] mt-5 bg-zinc-800/70"></div>

            <div>
                <h1 className="text-xl mt-3 flex"><p className="text-blue-200">2</p>. Estilo de imagem</h1>

                <div className="mt-5 mb-3 flex w-full items-center">
                    <p className="w-full">Cores de texto e fundo:</p>
                    <div className="w-full flex">
                        <input
                            type="color"
                            value={settings.textColor}
                            onChange={(e) => updateSetting("textColor", e.target.value)}
                            className="h-7 w-full [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]"
                        />

                        <input
                            type="color"
                            value={settings.backgroundColor}
                            onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                            className="h-7 w-full -ml-3 [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
                        />
                    </div>
                </div>

                <div className="flex gap-x-7 mt-5 mb-3">
                    <div className="w-[183px] flex flex-col">
                        <h2 className="mb-2">Fonte</h2>
                        <CustomDropdown data={[
                            { fieldText: "Inter", fieldValue: "Inter", fieldName: "font" },
                            { fieldText: "Plus Jakarta Sans", fieldValue: "PlusJakartaSans", fieldName: "font" },
                            { fieldText: "Open Sans", fieldValue: "OpenSans", fieldName: "font" },
                            { fieldText: "Roboto", fieldValue: "Roboto", fieldName: "font" },
                            { fieldText: "Outfit", fieldValue: "Outfit", fieldName: "font" }
                        ]} defineValue={updateSetting} />
                    </div>
                </div>

                <div className="flex gap-x-7 justify-center mt-5 mb-3">
                    <div className="w-full flex flex-col">
                        <h2 className="mb-2">Timestamps</h2>
                        <CustomDropdown data={[
                            { fieldText: "Mostrar", fieldValue: true, fieldName: "timestamps" },
                            { fieldText: "Não mostrar", fieldValue: false, fieldName: "timestamps" }
                        ]} defineValue={updateSetting} />
                    </div>

                    <div className="w-full flex flex-col">
                        <h2 className="mb-2">Metadados</h2>
                        <CustomDropdown data={[
                            { fieldText: "Mostrar", fieldValue: true, fieldName: "metadata" },
                            { fieldText: "Não mostrar", fieldValue: false, fieldName: "metadata" },
                        ]} defineValue={updateSetting} />
                    </div>
                </div>
            </div>

            <div className="w-full h-[2px] mt-3 bg-zinc-800/70"></div>

            <div className="flex flex-col mt-3 mb-3">
                <h1 className="text-xl flex"><p className="text-blue-200">3</p>. Saída</h1>

                <div className="flex gap-x-7  mt-5 mb-3">
                    <div className="w-[250px] flex flex-col">
                        <h2 className="mb-2">Formato</h2>
                        <CustomDropdown data={[
                            { fieldText: "PNG - Maxima qualidade ", fieldValue: "png", fieldName: "outputFormat" },
                            { fieldText: "JPEG - Muito boa qualidade", fieldValue: "jpeg", fieldName: "outputFormat" },
                            { fieldText: "WEBP - Boa qualidade", fieldValue: "webp", fieldName: "outputFormat" }
                        ]} defineValue={updateSetting} />
                    </div>
                </div>
            </div>

            <button onClick={
                async () => await submitForm({
                    ...settings, video
                })
            } className="w-full rounded-md p-3 mt-5 text-xl bg-blue-800/60 flex justify-center items-center gap-x-3 hover:opacity-70 cursor-pointer">
                <MdOutlineFileDownload className="text-3xl" />
                Gerar
            </button>

        </div >
    )
}