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

const ReferenceForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [references, setReferences] = useState<IReferences[]>(
    resumeInfo.references || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ id: string }>();

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
    if (!params?.id) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeData(params.id, {
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

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("References Component: ", references);
  }, [references]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">References</h2>

      {references.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No references added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {references.map((ref, index) => (
            <motion.div
              key={ref.reId}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">
                  Reference #{index + 1}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveReference(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveReference(index, "down")}
                    disabled={index === references.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
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
  );
};

export default ReferenceForm;
