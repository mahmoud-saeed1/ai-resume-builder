import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import { VForm } from '@/animation';

const NoData = ({ message }: { message: string }) => {
    return (
        <motion.div
            variants={VForm}
            initial="initial"
            animate="animate"
            exit="exit"
            className="no-data__container"
        >
            <CircleAlert />
            <p className="no-data__message text-center text-lg text-gray-700">
                {message}
            </p>
        </motion.div>
    );
};

export default NoData;