import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ICertification, IErrorResponse, IFormProbs } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";
import FormInput from "./FormInput";
import NoData from "./NoData";
import { VForm } from "@/animation";

const CertificationsForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [certifications, setCertifications] = useState<ICertification[]>(
    resumeInfo?.certifications || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.certifications && resumeInfo.certifications.length > 0) {
      setCertifications(resumeInfo.certifications);
    }

  }, [])

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    certId: string,
    field: keyof ICertification,
    value: string
  ) => {
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.ceId === certId ? { ...cert, [field]: value } : cert
      )
    );
    setResumeInfo((prev) => ({
      ...prev,
      certifications,
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
        certifications,
      });

      if (status === 200) {
        toast.success("Certifications saved successfully.", {
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

  const handleAddCertification = () => {
    const newCertification: ICertification = {
      ceId: uuidv4(),
      title: "",
      issuer: "",
      date: "",
    };
    setCertifications((prev) => [...prev, newCertification]);
    setResumeInfo((prev) => ({
      ...prev,
      certifications: [...certifications, newCertification],
    }));
  };

  const handleRemoveCertification = (certId: string) => {
    setCertifications((prev) => prev.filter((cert) => cert.ceId !== certId));
    setResumeInfo((prev) => ({
      ...prev,
      certifications: certifications.filter((cert) => cert.ceId !== certId),
    }));
  };

  const handleMoveCertification = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedCertifications = [...certifications];
    const movedCertification = updatedCertifications.splice(index, 1);
    updatedCertifications.splice(newIndex, 0, movedCertification[0]);
    setCertifications(updatedCertifications);
    setResumeInfo((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  };

  return (
    <div className="resume-form">
      <h2 className="form-title">Certifications</h2>

      <div className="form__scroll-bar">
        {certifications.length === 0 ? (
          <NoData message="No Certifications added yet." />
        ) : (
          <AnimatePresence>
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.ceId}
                variants={VForm}
                initial="initial"
                animate="animate"
                exit="exit"
                className="from__container"
              >
                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4>
                    Certification #{index + 1}
                  </h4>

                  {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveCertification(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveCertification(index, "down")}
                      disabled={index === certifications.length - 1}
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
                    type="text"
                    placeholder="Title"
                    defaultValue={cert.title}
                    onChange={(e) =>
                      handleInputChange(cert.ceId, "title", e.target.value)
                    }
                  />

                  <FormInput
                    id={uuidv4()}
                    label={"Issuer"}
                    type="text"
                    placeholder="Issuer"
                    defaultValue={cert.issuer}
                    onChange={(e) =>
                      handleInputChange(cert.ceId, "issuer", e.target.value)
                    }
                  />

                  <FormInput
                    id={uuidv4()}
                    label={"Date"}
                    type="date"
                    placeholder="Date"
                    defaultValue={cert.date}
                    onChange={(e) =>
                      handleInputChange(cert.ceId, "date", e.target.value)
                    }
                  />

                </form>

                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant={"danger"}
                    size="sm"
                    onClick={() => handleRemoveCertification(cert.ceId)}
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
          onClick={handleAddCertification}
          variant="success"
          className="mb-4"
          fullWidth
        >
          Add Certification
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          onClick={handleOnSubmit}
          disabled={enableNextBtn}
          fullWidth
        >
          Save Certifications
        </Button>
      </div>

    </div>
  );
};

export default CertificationsForm;
