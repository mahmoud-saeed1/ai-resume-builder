import Button from "@/ui/Button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PersonalDataForm from "./forms/PersonalDataFrom";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import CertificationsForm from "./forms/CertificationsForm";
import ProjectsForm from "./forms/ProjectsForm";
import LanguagesForm from "./forms/LanguagesForm";
import ReferenceForm from "./forms/ReferenceForm";

const FormSection = () => {
  /*~~~~~~~~~~ States ~~~~~~~~~~*/
  const [activeFormIdx, setActiveFormIdx] = useState(1);
  const [enableNextBtn, setEnableNextBtn] = useState(false);
  const { resumeId } = useParams<{ resumeId: string }>();

  /*~~~~~~~~~~ Form Configurations ~~~~~~~~~~*/
  const forms = [
    PersonalDataForm,
    SummaryForm,
    EducationForm,
    ExperienceForm,
    ProjectsForm,
    CertificationsForm,
    SkillsForm,
    LanguagesForm,
    ReferenceForm,
  ];

  /*~~~~~~~~~~ Handlers ~~~~~~~~~~*/
  const handleNavigation = (direction: "next" | "prev") => {
    setActiveFormIdx((prev) =>
      direction === "next" ? prev + 1 : prev - 1
    );
    setEnableNextBtn(false); //? Reset next button state on navigation
  };

  const CurrentForm = forms[activeFormIdx - 1];

  /*~~~~~~~~~~ Render ~~~~~~~~~~*/
  return (
    <div className="form-section">
      {/* Navigation Buttons */}
      <div className="form-section__nav flex items-center justify-between">
        {/* Home Button */}
        <Link to="/dashboard" className="text-white capitalize text-lg">
          <Button>
            <Home />
          </Button>
        </Link>

        {/* Previous and Next Buttons */}
        <div className="form-section__actions flex items-center space-x-2">
          {activeFormIdx > 1 && (
            <Button
              className="text-white capitalize text-lg"
              onClick={() => handleNavigation("prev")}
            >
              <ArrowLeft /> Prev
            </Button>
          )}
          <Button
            className="text-white capitalize text-lg"
            onClick={() => handleNavigation("next")}
            disabled={!enableNextBtn || activeFormIdx === forms.length + 1}
            variant="success"
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Form Renderer */}
      {CurrentForm && (
        <CurrentForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={() => setEnableNextBtn(true)}
          handleDisableNextBtn={() => setEnableNextBtn(false)}
        />
      )}

      {/* Redirect After Last Form */}
      {activeFormIdx === forms.length + 1 && (
        <Navigate to={`/my-resume/${resumeId}/view`} />
      )}
    </div>
  );
};

export default FormSection;
