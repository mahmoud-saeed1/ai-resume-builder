import { useContext, useState, useEffect } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IErrorResponse, IFormProbs, IProjects } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";
import FormInput from "./FormInputs";
import FormTextarea from "./FormTextArea";

const ProjectForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [projects, setProjects] = useState<IProjects[]>(
    resumeInfo?.projects || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ id: string }>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    projectId: string,
    field: keyof IProjects,
    value: string
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.prId === projectId ? { ...project, [field]: value } : project
      )
    );
    setResumeInfo((prev) => ({
      ...prev,
      projects,
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
        projects,
      });

      if (status === 200) {
        toast.success("Projects saved successfully.", {
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

  const handleAddProject = () => {
    const newProject: IProjects = {
      prId: uuidv4(),
      title: "",
      description: "",
    };
    setProjects((prev) => [...prev, newProject]);
    setResumeInfo((prev) => ({
      ...prev,
      projects: [...projects, newProject],
    }));
  };

  const handleRemoveProject = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.prId !== projectId));
    setResumeInfo((prev) => ({
      ...prev,
      projects: projects.filter((project) => project.prId !== projectId),
    }));
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedProjects = [...projects];
    const movedProject = updatedProjects.splice(index, 1);
    updatedProjects.splice(newIndex, 0, movedProject[0]);
    setProjects(updatedProjects);
    setResumeInfo((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("Project Component: ", projects);
  }, [projects]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Projects</h2>

      {projects.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No projects added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.prId}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">Project #{index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveProject(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveProject(index, "down")}
                    disabled={index === projects.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <FormInput
                  id={uuidv4()}
                  label={"Title"}
                  placeholder="Title"
                  defaultValue={project.title}
                  onChange={(e) =>
                    handleInputChange(project.prId, "title", e.target.value)
                  }
                />

                <FormTextarea
                  id={uuidv4()}
                  label={"Description"}
                  placeholder="Description"
                  defaultValue={project.description}
                  onChange={(e) =>
                    handleInputChange(
                      project.prId,
                      "description",
                      e.target.value
                    )
                  }
                />
              </form>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"danger"}
                  size="sm"
                  onClick={() => handleRemoveProject(project.prId)}
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
        onClick={handleAddProject}
        variant="outline"
        className="mb-4"
      >
        Add Project
      </Button>

      <Button
        type="submit"
        variant="success"
        isLoading={isLoading}
        onClick={handleOnSubmit}
        disabled={enableNextBtn}
      >
        Save Projects
      </Button>
    </div>
  );
};

export default ProjectForm;
