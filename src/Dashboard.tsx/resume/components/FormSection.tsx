import Button from "@/ui/Button";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { useState } from "react";

const FormSection = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [activeFromIdx, setActiveFromIdx] = useState(1);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleNext = () => {
    setActiveFromIdx((prev) => prev + 1);
  };

  const handlePrev = () => {
    setActiveFromIdx((prev) => prev - 1);
  };

  return (
    <div className="flex items-start justify-between">
      <Button variant={"outline"}  onClick={handlePrev}>
        <LayoutGrid size="sm" />
      </Button>

      <div className="flex items-center space-x-2">
        {activeFromIdx > 1 && (
          <Button
            className="text-white capitalize tracking-wider text-lg"
          >
            <ArrowLeft />
          </Button>
        )}
        <Button
          className="text-white capitalize tracking-wider text-lg"
          onClick={handleNext}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default FormSection;
