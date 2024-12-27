import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IFormProbs, IProjects, IErrorResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import NoData from "./NoData";
import FormInput from "./FormInput";
import { AxiosError } from "axios";
import { ProjectSchema } from "@/validation"; // Ensure you import the correct validation schema

const ProjectsForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Forms $~~~~~~~~*/
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<{ projects: IProjects[] }>({
    resolver: yupResolver(ProjectSchema),
    defaultValues: {
      projects: resumeInfo?.projects || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "projects",
  });

  const projects = watch("projects");

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  //! Sync local state with resumeInfo context
  useEffect(() => {
    if (resumeInfo?.projects) {
      reset({ projects: resumeInfo.projects });
    }
  }, [reset]);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleUpdateResumeInfo = useCallback(
    (updatedProjects: IProjects[]) => {
      setResumeInfo((prev) => ({
        ...prev,
        projects: updatedProjects,
      }));
    },
    [setResumeInfo]
  );

  const handleAddProject = () => {
    const newProject: IProjects = {
      title: "",
      description: "",
      projectUrl: "",
    };
    append(newProject);
    handleDisableNextBtn();
  };

  const handleInputChange = useCallback(
    (index: number, field: keyof IProjects, value: string) => {
      setValue(`projects.${index}.${field}`, value, { shouldValidate: true });
      trigger(`projects.${index}.${field}`);
      handleDisableNextBtn();

      //! Real-time update of context when project changes
      setResumeInfo((prev) => {
        const updatedProjects = [...(prev?.projects || [])];
        updatedProjects[index] = {
          ...updatedProjects[index],
          [field]: value,
        };
        return { ...prev, projects: updatedProjects };
      });
    },
    [setValue, trigger, handleDisableNextBtn]
  );

  const handleChange =
    (index: number, field: keyof IProjects) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleInputChange(index, field, e.target.value);
      };

  const handleRemoveProject = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { projects: IProjects[] }) => {
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
      const projectsWithoutId = data.projects.map(({ id, ...rest }) => { console.log(id); return rest; });
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        projects: projectsWithoutId,
      });

      if (status === 200) {
        toast.success("Projects saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleUpdateResumeInfo(data.projects);
        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      toast.error(err.response?.data.error.message || "An error occurred", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicFormInput = ({
    name,
    label,
    index,
    type = "text",
  }: {
    name: `projects.${number}.${keyof IProjects}`;
    label: string;
    index: number;
    type?: string;
  }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={projects?.[index]?.[name.split(".")[2] as keyof IProjects] || ""}
      render={({ field }) => (
        <FormInput
          {...field}
          id={name}
          type={type}
          label={label}
          placeholder={`Enter ${label}`}
          errorMessage={
            errors.projects?.[index]?.[
              name.split(".")[2] as keyof IProjects
            ]?.message
          }
          onChange={(e) =>
            handleChange(index, name.split(".")[2] as keyof IProjects)(e)
          }
        />
      )}
    />
  );

  return (
    <div className="resume-form">
      <h2 className="form-title">Projects</h2>
      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No Projects added yet." />
        ) : (
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                className="form__container"
              >
                <div className="form__container-header">
                  <h4>Project #{index + 1}</h4>
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
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveProject(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>
                <form className="form-content">
                  {dynamicFormInput({ name: `projects.${index}.title`, label: "Title", index })}
                  {dynamicFormInput({ name: `projects.${index}.description`, label: "Description", index })}
                  {dynamicFormInput({ name: `projects.${index}.projectUrl`, label: "Project URL", index })}
                </form>
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveProject(index)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <Button
        type="button"
        variant="success"
        className="mb-4"
        fullWidth
        onClick={handleAddProject}
      >
        Add Project
      </Button>
      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        onClick={handleSubmit(handleOnSubmit)}
        disabled={enableNextBtn}
      >
        Save Projects
      </Button>
    </div>
  );
};

export default ProjectsForm;
