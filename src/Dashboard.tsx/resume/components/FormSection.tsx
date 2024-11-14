import Button from "@/ui/Button";
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from "lucide-react";
import { useState } from "react";
import PersonalDataFrom from "./forms/PersonalDataFrom";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import CertificationForm from "./forms/CertificationForm";
import ProjectForm from "./forms/ProjectForm";
import LanguagesForm from "./forms/LanguagesForm";
import ReferenceForm from "./forms/ReferenceForm";
import { Link, Navigate, useParams } from "react-router-dom";

const FormSection = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [activeFromIdx, setActiveFromIdx] = useState(1);
  const [enableNextBtn, setEnableNextBtn] = useState(false);
  const params = useParams<{ resumeId: string }>();


  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleEnableNextBtn = () => setEnableNextBtn(true);

  const handleDisableNextBtn = () => setEnableNextBtn(false);

  //! handle next button with plus 1 until the last form
  const handleNext = () => {
    if (activeFromIdx < 6) {
      setActiveFromIdx((prev) => prev + 1);
      handleEnableNextBtn();
    } else {
      handleDisableNextBtn();
    }
  };

  //! handle previous button with minus 1 until the first form
  const handlePrev = () => {
    if (activeFromIdx > 1) {
      setActiveFromIdx((prev) => prev - 1);
      handleEnableNextBtn();
    } else {
      handleDisableNextBtn();
    }
  };


  return (
    <div>
      {/*~~~~~~~~$ Form Buttons $~~~~~~~~*/}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            to="/dashboard"
            className="text-white capitalize tracking-wider text-lg"
          >
            <Button>
              <Home />
            </Button>
          </Link>

          <Button variant={"outline"} onClick={handlePrev}>
            <LayoutGrid />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {activeFromIdx > 1 && (
            <Button
              className="text-white capitalize tracking-wider text-lg"
              onClick={handlePrev}
            >
              <ArrowLeft />
              prev
            </Button>
          )}
          <Button
            className="text-white capitalize tracking-wider text-lg"
            onClick={handleNext}
            disabled={!enableNextBtn}
          >
            next <ArrowRight />
          </Button>
        </div>
      </div>

      {/*~~~~~~~~$ Personal Data Form $~~~~~~~~*/}
      {activeFromIdx === 1 && (
        <PersonalDataFrom
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Summery Form$~~~~~~~~*/}
      {activeFromIdx === 2 && (
        <SummaryForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Education Form $~~~~~~~~*/}
      {activeFromIdx === 3 && (
        <EducationForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Professional Experience Form $~~~~~~~~*/}
      {activeFromIdx === 4 && (
        <ExperienceForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Project Form $~~~~~~~~*/}
      {activeFromIdx === 5 && (
        <ProjectForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Certification Form $~~~~~~~~*/}
      {activeFromIdx === 6 && (
        <CertificationForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Skills Form $~~~~~~~~*/}
      {activeFromIdx === 7 && (
        <SkillsForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Language Form $~~~~~~~~*/}
      {activeFromIdx === 8 && (
        <LanguagesForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ References Form $~~~~~~~~*/}
      {activeFromIdx === 9 && (
        <ReferenceForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {
        activeFromIdx === 10 && (
          <Navigate to={`/my-resume/${params.resumeId}/view`} />
        )
      }
    </div>
  );
};

export default FormSection;
