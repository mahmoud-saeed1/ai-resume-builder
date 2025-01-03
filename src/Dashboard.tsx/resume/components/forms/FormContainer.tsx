import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/ui/Button";
import { VForm } from "@/animation";
import NoData from "./NoData";
import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ICertification, IEducation, IExperience, ILanguages, IProjects, IReferences, ISkills } from "@/interfaces";

interface IFormContainer<T> {
    FormInputsList?: T[];
    formTitle: string;
    noDataMessage?: string;
    multipleForms?: boolean;
    className?: string;
    handleAddNewForm?: () => void;
    handleRemoveForm?: (id: string) => void;
    handleMoveForm?: (index: number, direction: "up" | "down") => void;
    handleOnSubmit: () => void;
    isLoading: boolean;
    enableNextBtn: boolean;
    children: React.ReactNode;
}

const FormContainer = <T extends IExperience | IEducation | IProjects | ICertification | ILanguages | ISkills | IReferences>({
    FormInputsList = [],
    formTitle,
    noDataMessage,
    multipleForms = false,
    className,
    handleAddNewForm,
    handleRemoveForm,
    handleMoveForm,
    handleOnSubmit,
    isLoading,
    enableNextBtn,
    children,
}: IFormContainer<T>) => {

    const { resumeInfo } = useContext(ResumeInfoContext)!;

    return (
        <div className="resume-form">
            <h2 className="form-title">{formTitle}</h2>


            <AnimatePresence>
                <motion.div
                    variants={VForm}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {multipleForms ?
                        <div className="form__scroll-bar">
                            {Array.isArray(FormInputsList) && FormInputsList.length === 0 ? (
                                <NoData message={noDataMessage || "No data available"} />
                            ) : (
                                FormInputsList.map((exp, index) => (
                                    <motion.div
                                        key={'exId' in exp ? (exp.exId as React.Key) : index}
                                        variants={VForm}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="from__container"
                                    >
                                        {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                                        <div className="form__container-header">
                                            <h4>
                                                {formTitle} #{index + 1}
                                            </h4>

                                            {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                                            <div className="move__btn-container">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={index === 0}
                                                    onClick={() => handleMoveForm && handleMoveForm(index, "up")}
                                                >
                                                    <ChevronUp className="move-icon" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleMoveForm && handleMoveForm(index, "down")}
                                                    disabled={
                                                        index === ((resumeInfo?.experience || []).length - 1)
                                                    }
                                                >
                                                    <ChevronDown className="move-icon" />
                                                </Button>
                                            </div>
                                        </div>


                                        {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
                                        {<div className="form__inputs">
                                            {children}
                                        </div>}

                                        {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
                                        <div className="remove-btn">
                                            <Button
                                                type="button"
                                                variant={"danger"}
                                                size="sm"
                                                onClick={() => handleRemoveForm && 'exId' in exp && handleRemoveForm(exp.exId as string)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div> : <div className={className}
                        >
                            {children}
                        </div>}
                </motion.div>
            </AnimatePresence>

            {/*~~~~~~~~$ Add & Save Button $~~~~~~~~*/}
            <div>
                {multipleForms && <Button
                    type="button"
                    onClick={handleAddNewForm}
                    variant="success"
                    className="mb-4"
                    fullWidth
                >
                    Add {formTitle}
                </Button>}

                <Button
                    type="submit"
                    isLoading={isLoading}
                    onClick={handleOnSubmit}
                    disabled={enableNextBtn}
                    fullWidth
                >
                    Save {formTitle}
                </Button>
            </div>
        </div>
    )
}

export default FormContainer