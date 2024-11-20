import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/ui/Button";
import { VForm } from "@/animation";
import NoData from "./NoData";
import { IExperience, IResumeInfo } from "@/interfaces";

interface IFormContainer {
    FormInputsList?: IExperience[];
    formTitle: string;
    noDataMessage?: string;
    multipleForms?: boolean;
    handleAddNewForm?: () => void;
    handleRemoveForm?: (exId: string) => void;
    handleMoveForm?: (index: number, direction: "up" | "down") => void;
    handleOnSubmit: () => void;
    isLoading: boolean;
    enableNextBtn: boolean;
    resumeInfo?: IResumeInfo;
    children: React.ReactNode;
}

const FormContainer = ({
    FormInputsList = [],
    formTitle,
    noDataMessage,
    multipleForms = false,
    handleAddNewForm,
    handleRemoveForm,
    handleMoveForm,
    handleOnSubmit,
    isLoading,
    enableNextBtn,
    resumeInfo,
    children,
}: IFormContainer) => {
    return (
        <div className="resume-form">
            <h2 className="form-title">{formTitle}</h2>

            <div className="form__scroll-bar">
                {(FormInputsList?.length ?? 0) === 0 && multipleForms ? (
                    <NoData message={noDataMessage || "No data available"} />
                ) : (
                    <AnimatePresence>
                        {multipleForms && FormInputsList.map((exp, index) => (
                            <motion.div
                                key={exp.exId}
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
                                <div className="form__inputs">
                                    {children}
                                </div>

                                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
                                <div className="remove-btn">
                                    <Button
                                        type="button"
                                        variant={"danger"}
                                        size="sm"
                                        onClick={() => handleRemoveForm && handleRemoveForm(exp.exId)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </motion.div>
                        ))}

                        {!multipleForms && (
                            <motion.div
                                variants={VForm}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="from__container"
                            >
                                <div className="form__inputs">
                                    {children}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

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