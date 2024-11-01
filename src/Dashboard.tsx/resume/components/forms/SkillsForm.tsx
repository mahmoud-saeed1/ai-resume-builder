import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ISkill } from "@/interfaces";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import Button from "@/ui/Button";
import StarRatings from 'react-star-ratings'; // Importing the react-star-ratings library

const SkillsForm = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [skills, setSkills] = useState<ISkill[]>(resumeInfo.skills || []);

  const handleInputChange = (skillId: string, field: keyof ISkill, value: string | number) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === skillId ? { ...skill, [field]: value } : skill
    );
    setSkills(updatedSkills);
    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleAddSkill = () => {
    const newSkill: ISkill = {
      id: uuidv4(),
      name: "",
      rating: 0, // Initial rating
    };
    setSkills([...skills, newSkill]);
    setResumeInfo((prev) => ({
      ...prev,
      skills: [...skills, newSkill],
    }));
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== skillId);
    setSkills(updatedSkills);
    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleMoveSkill = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedSkills = [...skills];
    const movedSkill = updatedSkills.splice(index, 1);
    updatedSkills.splice(newIndex, 0, movedSkill[0]);
    setSkills(updatedSkills);
    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
   console.log(skills)
  }, [skills])
  

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Skills</h2>

      {skills.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No skills added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              variants={animationVariants}
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
                    disabled={index === skills.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skill.name}
                  onChange={(e) => handleInputChange(skill.id, "name", e.target.value)}
                  className="w-full p-2 border rounded"
                />

                <label className="block mt-2">Rating:</label>

                {/* Using react-star-ratings */}
                <StarRatings
                  rating={skill.rating}
                  starRatedColor="gold"
                  starHoverColor="gold"
                  changeRating={(newRating) => handleInputChange(skill.id, "rating", newRating)}
                  numberOfStars={5}
                  name='rating'
                  starDimension="20px"
                  starSpacing="5px"
                />
              </form>
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
    </div>
  );
};

export default SkillsForm;
