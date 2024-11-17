import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IReferences, IErrorResponse, IFormProbs } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";
import FormInput from "./FormInputs";
import { VForm } from "@/animation";
import NoData from "./NoData";

const ReferenceForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [references, setReferences] = useState<IReferences[]>(
    resumeInfo?.references || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    refId: string,
    field: keyof IReferences,
    value: string
  ) => {
    setReferences((prev) =>
      prev.map((ref) => (ref.reId === refId ? { ...ref, [field]: value } : ref))
    );
    setResumeInfo((prev) => ({
      ...prev,
      references,
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
        references,
      });

      if (status === 200) {
        toast.success("References saved successfully.", {
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

  const handleAddReference = () => {
    const newReference: IReferences = {
      reId: uuidv4(),
      name: "",
      position: "",
      company: "",
      contact: "",
    };
    setReferences((prev) => [...prev, newReference]);
    setResumeInfo((prev) => ({
      ...prev,
      references: [...references, newReference],
    }));
  };

  const handleRemoveReference = (refId: string) => {
    setReferences((prev) => prev.filter((ref) => ref.reId !== refId));
    setResumeInfo((prev) => ({
      ...prev,
      references: references.filter((ref) => ref.reId !== refId),
    }));
  };

  const handleMoveReference = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedReferences = [...references];
    const movedReference = updatedReferences.splice(index, 1);
    updatedReferences.splice(newIndex, 0, movedReference[0]);
    setReferences(updatedReferences);
    setResumeInfo((prev) => ({
      ...prev,
      references: updatedReferences,
    }));
  };

  useEffect(() => {
    console.log("References Component: ", references);
  }, [references]);

  return (
    <div className="resume-form">
      <h2 className="form-title">References</h2>

      <div>
        {references.length === 0 ? (
          <NoData message="No References added yet." />
        ) : (
          <AnimatePresence>
            {references.map((ref, index) => (
              <motion.div
                key={ref.reId}
                variants={VForm}
                initial="initial"
                animate="animate"
                exit="exit"
                className="from__container"
              >
                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4>
                    Reference #{index + 1}
                  </h4>

                  {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveReference(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveReference(index, "down")}
                      disabled={index === references.length - 1}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>

                <form>

                  {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
                  <FormInput
                    id={uuidv4()}
                    label="Name"
                    type="text"
                    placeholder="Name"
                    defaultValue={ref.name}
                    onChange={(e) =>
                      handleInputChange(ref.reId, "name", e.target.value)
                    }
                  />

                  <FormInput
                    id={uuidv4()}
                    label="Position"
                    type="text"
                    placeholder="Position"
                    defaultValue={ref.position}
                    onChange={(e) =>
                      handleInputChange(ref.reId, "position", e.target.value)
                    }
                  />

                  <FormInput
                    id={uuidv4()}
                    label="Company"
                    type="text"
                    placeholder="Company"
                    defaultValue={ref.company}
                    onChange={(e) =>
                      handleInputChange(ref.reId, "company", e.target.value)
                    }
                  />

                  <FormInput
                    id={uuidv4()}
                    label="Contact"
                    type="text"
                    placeholder="Contact"
                    defaultValue={ref.contact}
                    onChange={(e) =>
                      handleInputChange(ref.reId, "contact", e.target.value)
                    }
                  />
                </form>

                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveReference(ref.reId)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/*~~~~~~~~$ Add & Save Button $~~~~~~~~*/}
      <div>
        <Button
          type="button"
          onClick={handleAddReference}
          variant="outline"
          className="mb-4"
        >
          Add Reference
        </Button>

        <Button
          type="submit"
          variant="success"
          isLoading={isLoading}
          onClick={handleOnSubmit}
          disabled={enableNextBtn}
        >
          Save References
        </Button>
      </div>
    </div>
  );
};

export default ReferenceForm;
