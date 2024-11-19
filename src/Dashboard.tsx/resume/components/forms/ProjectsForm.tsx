import { useContext, useEffect, useState } from "react";
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
import NoData from "./NoData";
import { VForm } from "@/animation";

const ProjectsForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [projects, setProjects] = useState<IProjects[]>(
    resumeInfo?.projects || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.projects && resumeInfo.projects.length > 0) {
      setProjects(resumeInfo.projects);
    }

  }, [])

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

  return (
    <div className="resume-form">
      <h2 className="form-title">Projects</h2>

      <div className="form__scroll-bar">
        {projects.length === 0 ? (
          <NoData message="No Projects added yet." />
        ) : (
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.prId}
                variants={VForm}
                initial="initial"
                animate="animate"
                exit="exit"
                className="from__container"
              >
                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4>Project #{index + 1}</h4>

                  {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveProject(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveProject(index, "down")}
                      disabled={index === projects.length - 1}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>

                <form className="form-content">
                  {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
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

                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
                <div className="remove-btn">
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
      </div>

      {/*~~~~~~~~$ Add & Save Button $~~~~~~~~*/}
      <div>
        <Button
          type="button"
          onClick={handleAddProject}
          variant="success"
          className="mb-4"
          fullWidth
        >
          Add Project
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          onClick={handleOnSubmit}
          disabled={enableNextBtn}
          fullWidth
        >
          Save Projects
        </Button>
      </div>

    </div>
  );
};

export default ProjectsForm;
