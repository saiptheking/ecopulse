import { useState } from "react";
import { HyperText } from "../components/velora/hyper-text";
import { api } from "wasp/client/api";
import { Stepper } from "../components/velora/stepper";
import { ConfettiButton } from "../components/velora/confetti";
import { FileDrop } from "../components/velora/file-drop";
import { useNavigate } from "react-router";
import { routes } from "wasp/client/router";
export const FileUploadPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File>();
  const [dropKey, setDropKey] = useState(0);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    const data = await api
      .post("/api/upload", { body: formData })
      .json<{ fileExists: boolean }>();
    setStep(3);
    setDropKey(dropKey + 1);
    alert("Thank you for your submission! Your file has been uploaded successfully.");
  };
  return (
    <div className="max-w-2xl mx-auto p-4">
      <HyperText className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl" onHover={true}>File Upload</HyperText>
    <form onSubmit={handleSubmit} className="rounded-xl border shadow hover:shadow-lg transition-all duration-300 text-card-foreground bg-muted/10 my-8 " style={{ padding: '1rem' }}>
    <Stepper
      className="mx-auto my-6 w-full max-w-md"
      steps={["Pick Challenge", "Upload File", "Done"]}
      current={step}
      onStepClick={(index) => {
        if (index === 0) {
          navigate(routes.FeedRoute.to);
        } else if (index == 1) {
          setStep(1);
          setDropKey(dropKey + 1);
        }
      }}
    />
      <FileDrop  accept="image/*" key={dropKey} onFiles={(e) => {
        setFile(e?.[0]);
        setStep(2);
          }} className="mx-auto block w-full" />
      <div className="mt-4">
        <ConfettiButton type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Upload</ConfettiButton>
      </div>
    </form>
    </div>
  );
};
