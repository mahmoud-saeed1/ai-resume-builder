import Header from "@/components/custom/Header";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/Dashboard.tsx/resume/components/ResumePreview";
import { IResumeInfo } from "@/interfaces";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RWebShare } from "react-web-share";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const ViewResume = () => {
    /*~~~~~~~~$ States $~~~~~~~~*/
    const [resumeInfo, setResumeInfo] = useState<IResumeInfo | undefined>(undefined);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const params = useParams<{ resumeId: string }>();

    /*~~~~~~~~$ Effects $~~~~~~~~*/
    useEffect(() => {
        handleGetResumeData();
    }, []);

    /*~~~~~~~~$ Handlers $~~~~~~~~*/
    const handleGetResumeData = () => {
        GlobalApi.GetResumeById(params.resumeId!).then((resp) => {
            setResumeInfo(resp.data.data);
        });
    };

    const handleDownloadResume = () => {
        setShowDownloadModal(true);
    };

    const confirmDownload = () => {
        setShowDownloadModal(false);
        window.print();
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo: resumeInfo || {} as IResumeInfo, setResumeInfo }}>
            {/*~~~~~~~~$ Celebration Confetti $~~~~~~~~*/}
            <Confetti recycle={false} numberOfPieces={300} />

            <div className="view-resume__container">
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
                        <Button onClick={handleShare} className="view-resume__button--share">
                            Share
                        </Button>
                    </div>
                </motion.div>

                {/*~~~~~~~~$ Resume Preview Area $~~~~~~~~*/}
                <motion.div
                    className="view-resume__preview-area"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    <div id="print-area">
                        <ResumePreview />
                    </div>
                </motion.div>

                {/*~~~~~~~~$ Download Confirmation Modal $~~~~~~~~*/}
                {showDownloadModal && (
                    <div className="modal">
                        <motion.div
                            className="modal__content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <h3 className="modal__title">Ready to Download?</h3>
                            <p className="modal__message">Your resume will be downloaded as a PDF file.</p>
                            <div className="modal__actions">
                                <Button onClick={confirmDownload} className="modal__button--confirm">Confirm</Button>
                                <Button onClick={() => setShowDownloadModal(false)} className="modal__button--cancel">Cancel</Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/*~~~~~~~~$ Share Modal $~~~~~~~~*/}
                {showShareModal && (
                    <div className="modal">
                        <motion.div
                            className="modal__content"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="modal__title">Share Your Resume</h3>
                            <p className="modal__message">Share this unique link to showcase your resume:</p>
                            <p className="modal__link">{`${import.meta.env.VITE_BASE_URL}/my-resume/${params.resumeId}/view`}</p>
                            <RWebShare
                                data={{
                                    text: "Check out my AI-generated resume!",
                                    url: `${import.meta.env.VITE_BASE_URL}/my-resume/${params.resumeId}/view`,
                                    title: "My AI-Generated Resume",
                                }}
                                onClick={() => console.log("Shared successfully!")}
                            >
                                <Button className="modal__button--share">Share Now</Button>
                            </RWebShare>
                            <Button onClick={() => setShowShareModal(false)} className="modal__button--close">Close</Button>
                        </motion.div>
                    </div>
                )}
            </div>
        </ResumeInfoContext.Provider>
    );
};

export default ViewResume;
