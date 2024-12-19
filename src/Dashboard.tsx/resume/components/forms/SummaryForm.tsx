import { IErrorResponse, IFormProbs, IGeneratedSummary } from "@/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useRef, useState } from "react";
import GlobalApi from "@/service/GlobalApi";
import { Form, useParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import Button from "@/ui/Button";
import { AxiosError } from "axios";
import { SSummary } from "@/validation";
import { Sparkles } from "lucide-react";
import { AIChatSession } from "@/service/AIModal";
import { motion } from "framer-motion";
import { Vsummary } from "@/animation";
import FormTextarea from "./FormTextArea";
import FormContainer from "./FormContainer";

const SummaryForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<IGeneratedSummary[]>([]);
  const [activeTextArea, setActiveTextArea] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};

  if (!setResumeInfo) {
    throw new Error("ResumeInfoContext is undefined");
  }

  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Form $~~~~~~~~*/
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<{ summary: string }>({
    resolver: yupResolver(SSummary),
  });

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setResumeInfo((prev) => ({
      ...prev,
      summary: value,
    }));

    clearErrors("summary");
    setValue("summary", value);
    handleDisableNextBtn();
    setActiveTextArea(true);
  };

  const handleOnSubmit: SubmitHandler<{ summary: string }> = async (data) => {
    setIsLoading(true);
    if (!params?.resumeId) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, data);
      if (status === 200) {
        toast.success("Data saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      toast.error(err.response?.data.error.message, {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerated(true);
    const jobTitle =
      resumeInfo?.personalData?.[0]?.jobTitle || "your job title";

    const prompt = `Job Title: ${jobTitle}. Please provide a JSON array containing summaries for three experience levels: Fresher, Mid-Level, and Senior.`;

    try {
      const { response } = await AIChatSession.sendMessage(prompt);
      const responseText = await response.text();

      if (responseText) {
        try {
          const parsedSummary: IGeneratedSummary[] = JSON.parse(responseText);
          setGeneratedSummary(parsedSummary);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          toast.error("Failed to generate summary. Please try again.", {
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
        }
      } else {
        console.warn("Empty response received.");
        toast.error("Failed to generate summary. Empty response received.", {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("An error occurred while generating the summary.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsGenerated(false);
    }
  };

  const handleSummaryClick = (summaryText: string) => {
    // Always set the summary value in the form
    setValue("summary", summaryText);
    
    // Update the context
    setResumeInfo((prev) => ({
      ...prev,
      summary: summaryText,
    }));

    // Reset the active text area state
    setActiveTextArea(true);
    
    // Scroll to the text area if needed
    textAreaRef.current?.scrollIntoView({ behavior: "smooth" });

    // hide generated summary
    setIsGenerated(false);
  };

  return (
    <FormContainer className="space-y-4" enableNextBtn={enableNextBtn} handleOnSubmit={handleSubmit(handleOnSubmit)} isLoading={isLoading} formTitle="Summary">

      <Button onClick={handleGenerateSummary} isLoading={isGenerated} variant={"success"}>
        Generate Summary <Sparkles width={"1rem"} className="ml-2" />
      </Button>

      {generatedSummary.length > 0 && (
        <div className="generated__summary-scroll">
          {generatedSummary.map((summary, index) => (
            <motion.div
              key={index}
              variants={Vsummary}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="generated-summary"
              onClick={() => handleSummaryClick(summary.summary)}
            >
              {summary.summary}
            </motion.div>
          ))}
        </div>)
      }

      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <FormTextarea
          id="summary"
          label="Summary"
          placeholder="Write a summary about yourself"
          register={register("summary")}
          onChange={handleInputChange}
          defaultValue={resumeInfo?.summary || ""}
          errorMessage={errors.summary?.message}
          ref={textAreaRef}
          className={activeTextArea ? "shadow-lg shadow-blue-500" : ""}
          style={{ border: activeTextArea ? "2px solid #2563EB" : "none" }}
        />
      </Form>
    </FormContainer>
  );
};

export default SummaryForm;
