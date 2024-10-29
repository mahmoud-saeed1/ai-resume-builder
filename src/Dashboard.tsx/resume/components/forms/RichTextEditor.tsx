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
import { Button } from "@/components/ui/button";
import { Brain, LoaderCircle } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/interfaces";

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
  const { resumeInfo } = useContext(ResumeInfoContext)!;
  const [value, setValue] = useState<string>(defaultValue || "");
  const [loading, setLoading] = useState<boolean>(false);

  const generateSummaryFromAI = async () => {
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

    const prompt = `Generate a highly engaging work summary based on the following:
      Position: ${exp.title},
      Company: ${exp.companyName},
      Location: ${exp.city}, ${exp.state},
      Start Date: ${exp.startDate},
      End Date: ${exp.currentlyWorking ? "Present" : exp.endDate}.
      Highlight impactful achievements, skill applications, and methodologies suitable for a recruiter.`;
      
    setLoading(true);
    try {
      const result = await AIChatSession.sendMessage(prompt);
      console.log(result)
      const response = await result.response.text();
      console.log(response)
      const formattedResponse = response.replace("[", "").replace("]", "");
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
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
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
        >
          <Toolbar>
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
