import { useState } from "react";
import { HeaderComponent } from "./components/header";
import { SideBarCompoent } from "./components/sidebar";
import { UploadComponent } from "./components/upload";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmitForm = async (data: any) => {
    setLoading(true)
    const formData = new FormData();

    formData.append("video", data.video);

    formData.append("grid", data.grid);
    formData.append("spacing", String(data.spacing));
    formData.append("ratio", data.ratio);
    formData.append("backgroundColor", data.backgroundColor);
    formData.append("textColor", data.textColor);
    formData.append("font", data.font);
    formData.append("outputFormat", data.outputFormat);
    formData.append("timestamps", String(data.timestamps));
    formData.append("metadata", String(data.metadata));

    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api/video";

    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: formData
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setImageFile(url)
    setLoading(false)
  }

  return (
    <div className="bg-black w-screen h-screen px-10">
      <HeaderComponent />
      <div className="w-full flex gap-x-6 h-[830px] py-3">
        <SideBarCompoent submitForm={handleSubmitForm} video={file} />
        <UploadComponent
          setFile={setFile}
          setImageFile={setImageFile}
          imageFile={imageFile}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default App