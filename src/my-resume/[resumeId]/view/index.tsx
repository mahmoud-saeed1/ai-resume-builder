import Header from "@/components/custom/Header";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/Dashboard.tsx/resume/components/ResumePreview";
import { IResumeInfo } from "@/interfaces";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { RWebShare } from "react-web-share";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

const ViewResume = () => {
    /*~~~~~~~~$ States $~~~~~~~~*/
    const [resumeInfo, setResumeInfo] = useState<IResumeInfo | undefined>(undefined);
    const params = useParams<{ resumeId: string }>();
    const printAreaRef = useRef<HTMLDivElement>(null); // Ref for the print area

    /*~~~~~~~~$ Effects $~~~~~~~~*/
    useEffect(() => {
        handleGetResumeData();
    }, []);

    /*~~~~~~~~$ Handlers $~~~~~~~~*/
    const handleGetResumeData = async () => {
        try {
            const response = await GlobalApi.GetResumeById(params.resumeId!);
            setResumeInfo(response.data.data);
        } catch (error) {
            console.error("Failed to fetch resume data:", error);
        }
    };

    const handleDownloadResume = () => {
        if (printAreaRef.current) {
            const options = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: `Resume-${params.resumeId}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            html2pdf()
                .from(printAreaRef.current)
                .set(options)
                .save()
                .catch((err) => console.error("Error generating PDF:", err));
        }
    };

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo: resumeInfo || {} as IResumeInfo, setResumeInfo }}>
            <div className="view-resume__container">
                <div id="no-print">
                    {/*~~~~~~~~$ Celebration Confetti $~~~~~~~~*/}
                    <Confetti className="w-screen h-screen" recycle={false} numberOfPieces={2000} />
                    <Header />

                    {/*~~~~~~~~$ Main Content $~~~~~~~~*/}
                    <motion.div
                        className="view-resume__content"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="view-resume__title">🎉 Congratulations! Your AI-Generated Resume is Ready</h2>
                        <p className="view-resume__description">
                            You can now download or share your unique resume with friends and family.
                        </p>
                        <div className="view-resume__actions">
                            <Button onClick={handleDownloadResume} className="view-resume__button--download">
                                Download
                            </Button>
                            <RWebShare
                                data={{
                                    text: "Check out my AI-generated resume!",
                                    url: `${import.meta.env.VITE_BASE_URL}/my-resume/${params.resumeId}/view`,
                                    title: "My AI-Generated Resume",
                                }}
                            >
                                <Button className="modal__button--share">Share Now</Button>
                            </RWebShare>
                        </div>
                    </motion.div>
                </div>

                {/*~~~~~~~~$ Resume Preview Area $~~~~~~~~*/}
                <motion.div
                    className="view-resume__preview-area"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    <div id="print-area" ref={printAreaRef}>
                        <ResumePreview />
                    </div>
                </motion.div>
            </div>
        </ResumeInfoContext.Provider>
    );
};

export default ViewResume;
