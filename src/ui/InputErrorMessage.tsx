import { m, LazyMotion, domAnimation } from "framer-motion";
import { VErrorMessage } from "../../animations";

interface IProps {
  msg?: string;
}
const InputErrorMessage = ({ msg }: IProps) => {
  return msg ? (
    <LazyMotion features={domAnimation}>
      <m.span
        variants={VErrorMessage}
        initial="initial"
        animate="animate"
        transition={{duration:0.3,ease:"easeInOut"}}
        className="block text-[#c2344d] font-semibold text-sm"
      >
        {msg}
      </m.span>
    </LazyMotion>
  ) : null;
};

export default InputErrorMessage;
