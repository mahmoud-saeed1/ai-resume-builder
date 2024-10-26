import { IErrorResponse, IFormProbs, IGeneratedSummary } from "@/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useState } from "react";
import GlobalApi from "@/service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import Button from "@/ui/Button";
import { AxiosError } from "axios";
import { SSummary } from "@/validation";
import Textarea from "@/ui/Textarea";
import { Sparkles } from "lucide-react";
import { AIChatSession } from "@/service/AIModal";
import { motion } from "framer-motion";
import { Vsummary } from "@/animation";

const SummaryForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<IGeneratedSummary[]>(
    []
  );
  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};

  if (!setResumeInfo) {
    throw new Error("ResumeInfoContext is undefined");
  }

  const params = useParams<{ id: string }>();

  /*~~~~~~~~$ Form $~~~~~~~~*/
  const {
    register,
    handleSubmit,
    setValue,
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
    handleDisableNextBtn();
  };

  const handleOnSubmit: SubmitHandler<{ summary: string }> = async (data) => {
    setIsLoading(true);

    if (!params?.id) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    // Log data and params.id for debugging
    console.log("Data to be sent:", data);
    console.log("Resume ID:", params.id);

    try {
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, data);
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

      // If error details exist, loop through and display each error
      if (err.response?.data.error?.details?.errors) {
        err.response.data.error.details.errors.forEach((e) =>
          toast.error(e.message, {
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          })
        );
      } else if (err.response?.data.error?.message) {
        // Otherwise, show the main error message
        toast.error(err.response.data.error.message, {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.error("Unknown error:", err);
        toast.error("An unexpected error occurred.", {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerated(true);
    const prompt = `Job Title: ${resumeInfo?.jobTitle}. Please provide a JSON array containing summaries for three experience levels: Fresher, Mid-Level, and Senior.`;

    try {
      const { response } = await AIChatSession.sendMessage(prompt);
      const responseText = await response.text();

      //** Check if the response text is valid JSON
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
    setValue("summary", summaryText);
    setResumeInfo((prev) => ({
      ...prev,
      summary: summaryText,
    }));
  };

  /*~~~~~~~~$ Animations & Variants $~~~~~~~~*/

  return (
    <div className="p-4 space-y-4 rounded-lg shadow-md bg-gray-100">
      <Button onClick={handleGenerateSummary} isLoading={isGenerated}>
        Generate Summary <Sparkles width={"1rem"} className="ml-2" />
      </Button>

      {generatedSummary.length > 0 && (
        <div className="space-y-2">
          {generatedSummary.map((summary, index) => (
            <motion.div
              key={index}
              variants={Vsummary}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="p-3 bg-white rounded-lg shadow cursor-pointer text-gray-800"
              onClick={() => handleSummaryClick(summary.summary)}
            >
              {summary.summary}
            </motion.div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="space-y-2">
          <label htmlFor="summary" className="text-gray-700 font-semibold">
            Summary
          </label>
          <Textarea
            {...register("summary")}
            id="summary"
            className="w-full p-2 bg-gray-50 border rounded-md focus:ring focus:ring-indigo-300"
            onChange={handleInputChange}
            defaultValue={resumeInfo?.summary}
          />
          {errors.summary && (
            <span className="text-red-500">{errors.summary.message}</span>
          )}
        </div>

        <Button
          fullWidth
          isLoading={isLoading}
          disabled={enableNextBtn}
          className="mt-4"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default SummaryForm;
