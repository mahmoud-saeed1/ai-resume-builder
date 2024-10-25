import Button from "@/ui/Button";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { useState } from "react";
import PersonalDataFrom from "./forms/PersonalDataFrom";

const FormSection = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [activeFromIdx, setActiveFromIdx] = useState(1);
  const [enableNextBtn, setEnableNextBtn] = useState(false);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleNext = () => {
    setActiveFromIdx((prev) => prev + 1);
  };

  const handlePrev = () => {
    setActiveFromIdx((prev) => prev - 1);
  };

  const handleEnableNextBtn = () => setEnableNextBtn(true);

  const handleDisableNextBtn = () => setEnableNextBtn(false);

  return (
    <div>
      {/*~~~~~~~~$ Form Buttons $~~~~~~~~*/}
      <div className="flex items-center justify-between">
        <Button variant={"outline"} onClick={handlePrev}>
          <LayoutGrid />
        </Button>

        <div className="flex items-center space-x-2">
          {activeFromIdx > 1 && (
            <Button className="text-white capitalize tracking-wider text-lg">
              <ArrowLeft />
            </Button>
          )}
          <Button
            className="text-white capitalize tracking-wider text-lg"
            onClick={handleNext}
            disabled={!enableNextBtn}
          >
            next
          </Button>
        </div>
      </div>

      {/*~~~~~~~~$ Personal Data Form $~~~~~~~~*/}
      <PersonalDataFrom
        enableNextBtn={enableNextBtn}
        handleEnableNextBtn={handleEnableNextBtn}
        handleDisableNextBtn={handleDisableNextBtn}
      />

      {/*~~~~~~~~$ Summery Form$~~~~~~~~*/}

      {/*~~~~~~~~$ Professional Experience Form $~~~~~~~~*/}

      {/*~~~~~~~~$ Education Form $~~~~~~~~*/}

      {/*~~~~~~~~$ Skills Form $~~~~~~~~*/}

      {/*~~~~~~~~$ Language Form $~~~~~~~~*/}
    </div>
  );
};

export default FormSection;
