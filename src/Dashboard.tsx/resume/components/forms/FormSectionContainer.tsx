// FormSectionContainer.tsx
import { ReactNode } from "react";
import Button from "@/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FormSectionContainerProps {
  fieldsLength: number;
  title: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onSubmit: () => void;
  isLoading: boolean;
  enableNextBtn: boolean;
  children: (index: number) => ReactNode; // Function to render the form content dynamically
  noDataMessage?: string;
}

const FormSectionContainer = ({
  fieldsLength,
  title,
  onAdd,
  onRemove,
  onMove,
  onSubmit,
  isLoading,
  enableNextBtn,
  children,
  noDataMessage = "No data added yet.",
}: FormSectionContainerProps) => {
  return (
    <div className="resume-form">
      <h2 className="form-title">{title}</h2>

      <div className="form__scroll-bar">
        {fieldsLength === 0 ? (
          <p className="no-data-message">{noDataMessage}</p>
        ) : (
          <AnimatePresence>
            {Array.from({ length: fieldsLength }, (_, index) => (
              <motion.div
                key={index}
                className="form__container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Section Header */}
                <div className="form__container-header">
                  <h4>
                    {title} #{index + 1}
                  </h4>

                  {/* Move Buttons */}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => onMove(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === fieldsLength - 1}
                      onClick={() => onMove(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>

                {/* Child Form Content */}
                {children(index)}

                {/* Remove Button */}
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => onRemove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add & Save Buttons */}
      <div>
        <Button type="button" onClick={onAdd} variant="success" fullWidth>
          Add {title}
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          onClick={onSubmit}
          disabled={enableNextBtn}
          fullWidth
        >
          Save {title}
        </Button>
      </div>
    </div>
  );
};

export default FormSectionContainer;
