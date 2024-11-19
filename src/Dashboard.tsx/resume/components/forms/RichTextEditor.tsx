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
      toast.error("Resume information is missing.");
      return;
    }

    setLoading(true);

    try {
      const exp = resumeInfo.experience[index];
      const result = await AIChatSession.sendMessage(
        `Generate a summary for ${exp.title} at ${exp.companyName}.`
      );

      const response = await result.response.text();
      const formattedResponse = response.replace(/\[|\]/g, ""); // Clean brackets
      setValue(formattedResponse);
      onRichTextEditorChange(formattedResponse);
    } catch {
      toast.error("Failed to generate AI summary.");
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
