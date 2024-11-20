import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ILanguages, IErrorResponse, IFormProbs } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";
import FormInput from "./FormInputs";
import FormSelect from "./FormSelect";
import NoData from "./NoData";

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];

const LanguagesForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [languagesList, setLanguagesList] = useState<ILanguages[]>(
    resumeInfo?.languages || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.languages && resumeInfo.languages.length > 0) {
      setLanguagesList(resumeInfo.languages);
    }

  }, [])

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    langId: string,
    field: keyof ILanguages,
    value: string
  ) => {
    setLanguagesList((prev) =>
      prev.map((lang) =>
        lang.laId === langId ? { ...lang, [field]: value } : lang
      )
    );
    setResumeInfo((prev) => ({
      ...prev,
      languages: languagesList,
    }));

    handleDisableNextBtn();
  };

  const handleOnSubmit = async () => {
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
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        languages: languagesList,
      });

      if (status === 200) {
        toast.success("Languages saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });

        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      if (err.response?.data.error.details) {
        err.response.data.error.details.errors.forEach((e) => {
          toast.error(e.message, {
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
        });
      } else {
        toast.error(err.response?.data.error.message, {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLanguage = () => {
    const newLanguage: ILanguages = {
      laId: uuidv4(),
      name: "",
      proficiency: "",
    };
    setLanguagesList((prev) => [...prev, newLanguage]);
    setResumeInfo((prev) => ({
      ...prev,
      languages: [...languagesList, newLanguage],
    }));
  };

  const handleRemoveLanguage = (langId: string) => {
    setLanguagesList((prev) => prev.filter((lang) => lang.laId !== langId));
    setResumeInfo((prev) => ({
      ...prev,
      languages: languagesList.filter((lang) => lang.laId !== langId),
    }));
  };

  const handleMoveLanguage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedLanguages = [...languagesList];
    const movedLanguage = updatedLanguages.splice(index, 1);
    updatedLanguages.splice(newIndex, 0, movedLanguage[0]);
    setLanguagesList(updatedLanguages);
    setResumeInfo((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("Languages Component: ", languagesList);
  }, [languagesList]);

  return (
    <div className="resume-form">
      <h2 className="form-title">Languages</h2>

      <div className="form__scroll-bar">
        {languagesList.length === 0 ? (
          <NoData message="No Languages added yet." />
        ) : (
          <AnimatePresence>
            {languagesList.map((lang, index) => (
              <motion.div
                key={lang.laId}
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="from__container"
              >

                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4 className="font-semibold text-sm">Language #{index + 1}</h4>

                  {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveLanguage(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveLanguage(index, "down")}
                      disabled={index === languagesList.length - 1}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>

                <form className="form-content">

                  {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
                  <FormInput
                    id={uuidv4()}
                    placeholder="Language"
                    label="Language"
                    type="text"
                    defaultValue={lang.name}
                    onChange={(e) =>
                      handleInputChange(lang.laId, "name", e.target.value)
                    }
                  />

                  <FormSelect
                    id={uuidv4()}
                    label="Proficiency"
                    defaultValue={lang.proficiency}
                    onChange={(e) =>
                      handleInputChange(lang.laId, "proficiency", e.target.value)
                    }
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </FormSelect>
                </form>

                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveLanguage(lang.laId)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

      </div>


      <div>
        <Button
          type="button"
          onClick={handleAddLanguage}
          variant="success"
          className="mb-4"
          fullWidth
        >
          Add Language
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          onClick={handleOnSubmit}
          disabled={enableNextBtn}
          fullWidth
        >
          Save Languages
        </Button>
      </div>

    </div>
  );
};

export default LanguagesForm;
