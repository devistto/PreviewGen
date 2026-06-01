import { FaGithub } from "react-icons/fa";

export const HeaderComponent = () => {
    return (
        <div className="flex justify-between items-center h-16">

            <div className="flex items-center h-full text-white gap-x-3">
                <img src="../public/logo.png" className="w-8 h-8" />
                <p className="font-bold text-xl">PreviewGen</p>
            </div>

            <div className="flex gap-x-3 text-white items-center">
                <a href="https://github.com/devistto/PreviewGen" className="flex hover:opacity-80 items-center gap-x-2 border border-zinc-800/80 px-3 bg-zinc-800/70 py-2">
                    <FaGithub className="text-xl"/>
                    <p className="text-sm">Github</p>
                </a>
            </div>

        </div>
    )
}