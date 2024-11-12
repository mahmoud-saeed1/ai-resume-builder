import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IErrorResponse, IFormProbs, ISkills } from "@/interfaces";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/ui/Button";
import StarRatings from "react-star-ratings"; // Importing the react-star-ratings library
import { useParams } from "react-router-dom";
import { VForm } from "@/animation";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import { AxiosError } from "axios";
import FormInput from "./FormInputs";

const SkillsForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [skillsList, setSkillsList] = useState<ISkills[]>(
    resumeInfo?.skills || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams<{ resumeId: string }>();

  const handleInputChange = (
    skillId: string,
    field: keyof ISkills,
    value: string | number
  ) => {
    const updatedSkills = skillsList.map((skill) =>
      skill.skId === skillId ? { ...skill, [field]: value } : skill
    );
    setSkillsList(updatedSkills);
    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
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
        skills: skillsList,
      });

      if (status === 200) {
        toast.success("Education saved successfully.", {
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

  const handleAddSkill = () => {
    const newSkill: ISkills = {
      skId: uuidv4(),
      name: "",
      rating: 0,
    };
    setSkillsList([...skillsList, newSkill]);
    setResumeInfo((prev) => ({
      ...prev,
      skills: [...skillsList, newSkill],
    }));
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skillsList.filter((skill) => skill.skId !== skillId);
    setSkillsList(updatedSkills);
    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleMoveSkill = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedSkills = [...skillsList];
    const movedSkill = updatedSkills.splice(index, 1);
    updatedSkills.splice(newIndex, 0, movedSkill[0]);
    setSkillsList(updatedSkills);
    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  useEffect(() => {
    console.log(skillsList);
  }, [skillsList]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Skills</h2>

      {skillsList.length === 0 ? (
        <motion.div
          variants={VForm}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No skills added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {skillsList.map((skill, index) => (
            <motion.div
              key={index}
              variants={VForm}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">Skill #{index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveSkill(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveSkill(index, "down")}
                    disabled={index === skillsList.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <FormInput
                  id={uuidv4()}
                  placeholder="Skill Name"
                  label="Skill Name"
                  type="text"
                  defaultValue={skill.name}
                  onChange={(e) =>
                    handleInputChange(skill.skId, "name", e.target.value)
                  }
                />

                <StarRatings
                  rating={skill.rating}
                  starRatedColor="gold"
                  starHoverColor="gold"
                  changeRating={(newRating) =>
                    handleInputChange(skill.skId, "rating", newRating)
                  }
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  starSpacing="5px"
                />
              </form>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveSkill(skill.skId)}
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
        onClick={handleAddSkill}
        variant="outline"
        className="mb-4"
      >
        Add Skill
      </Button>
      <Button
        type="submit"
        variant="success"
        isLoading={isLoading}
        onClick={handleOnSubmit}
        disabled={enableNextBtn}
      >
        Save Skills
      </Button>
    </div>
  );
};

export default SkillsForm;
