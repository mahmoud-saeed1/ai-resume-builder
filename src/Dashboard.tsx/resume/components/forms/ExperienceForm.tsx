import { useContext, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IExperience } from "@/interfaces";
import RichTextEditor from "./RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const ExperienceForm = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [experience, setExperience] = useState<IExperience[]>(
    resumeInfo.experience || []
  );

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    id: string,
    field: keyof IExperience,
    value: string | boolean
  ) => {
    setExperience((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
    setResumeInfo((prev) => ({
      ...prev,
      experience,
    }));
  };

  const handleAddExperience = () => {
    const newExperience: IExperience = {
      id: Date.now().toString(),
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummary: "",
    };
    setExperience((prev) => [...prev, newExperience]);
    setResumeInfo((prev) => ({
      ...prev,
      experience: [...experience, newExperience],
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setExperience((prev) => prev.filter((exp) => exp.id !== id));
    setResumeInfo((prev) => ({
      ...prev,
      experience: experience.filter((exp) => exp.id !== id),
    }));
  };

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedExperience = [...experience];
    const movedExperience = updatedExperience.splice(index, 1);
    updatedExperience.splice(newIndex, 0, movedExperience[0]);
    setExperience(updatedExperience);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Experience</h2>

      <AnimatePresence>
        {experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border p-4 rounded-lg shadow-md space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-sm">Experience #{index + 1}</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => handleMoveExperience(index, "up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveExperience(index, "down")}
                  disabled={index === (resumeInfo.experience || []).length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Position Title"
              value={exp.title}
              onChange={(e) =>
                handleInputChange(exp.id, "title", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={exp.companyName}
              onChange={(e) =>
                handleInputChange(exp.id, "companyName", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={exp.city}
              onChange={(e) =>
                handleInputChange(exp.id, "city", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-4">
              <input
                type="date"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) =>
                  handleInputChange(exp.id, "startDate", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              {!exp.currentlyWorking && (
                <input
                  type="date"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) =>
                    handleInputChange(exp.id, "endDate", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                title="Currently Working"
                checked={exp.currentlyWorking}
                onChange={(e) =>
                  handleInputChange(
                    exp.id,
                    "currentlyWorking",
                    e.target.checked
                  )
                }
              />
              <label>Currently Working</label>
            </div>
            <RichTextEditor
              index={index}
              onRichTextEditorChange={(content) =>
                handleInputChange(exp.id, "workSummary", content)
              }
              defaultValue={exp.workSummary}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <Button onClick={handleAddExperience} variant="outline" className="mb-4">
        Add Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;
