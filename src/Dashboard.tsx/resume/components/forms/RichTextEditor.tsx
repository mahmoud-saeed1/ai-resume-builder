import React, { useContext, useState } from "react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  Separator,
} from "react-simple-wysiwyg";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { AIChatSession } from "@/service/AIModal";
import { Brain, LoaderCircle } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/interfaces";
import Button from "@/ui/Button";

interface IRichTextEditorProps {
  onRichTextEditorChange: (content: string) => void;
  index: number;
  defaultValue?: string;
}

const RichTextEditor = ({
  onRichTextEditorChange,
  index,
  defaultValue,
}: IRichTextEditorProps) => {
  const resumeInfoContext = useContext(ResumeInfoContext);
  const resumeInfo = resumeInfoContext?.resumeInfo;
  const [value, setValue] = useState<string>(defaultValue || "");
  const [loading, setLoading] = useState<boolean>(false);

  const generateSummaryFromAI = async () => {
    if (!resumeInfo) {
      toast.error("Resume information is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    const exp = resumeInfo.experience ? resumeInfo.experience[index] : null;
    if (!exp) {
      toast.error("Experience information is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    if (!exp?.title || !exp?.companyName) {
      toast.error("Please Add Position Title and Company Name", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const prompt = `Please provide a JSON array containing highly engaging work summary based on the following:
      Position: ${exp.title},
      Company: ${exp.companyName},
      Location: ${exp.city}, ${exp.state},
      Start Date: ${exp.startDate},
      End Date: ${exp.currentlyWorking ? "Present" : exp.endDate}.
      Highlight impactful achievements, skill applications, and methodologies suitable for a recruiter.
      and send me response like this [{"summary":"vlaue"}].
      `;

    setLoading(true);
    try {
      const result = await AIChatSession.sendMessage(prompt);
      console.log(result)
      const response = await result.response.text();
      console.log(response)
      const formattedResponse = response.replace("[", "").replace("]", "").replace(/"/g, "").replace("{", "").replace("}", "");
      setValue(formattedResponse);
      onRichTextEditorChange(formattedResponse);
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      toast.error(err.message || "Failed to generate summary.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label>Summary</label>
        <Button
          size="sm"
          onClick={generateSummaryFromAI}
          disabled={loading}
          variant="success"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" />
              <p className="ml-1">
                Generate from AI</p>
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value);
          }}
          className="bg-white border border-gray-300 rounded-b-xl p-2 focus:border-none focus:outline-none"
        >
          <Toolbar className="focus:border-none focus:outline-none rounded-b-xl">
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
