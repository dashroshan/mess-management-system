import { motion, AnimatePresence } from "framer-motion";
import classes from "./fade.module.css";

// Fades from prop one to prop two, when prop one2Two is true
export default function Fade(props) {
    return (
        <div className={classes.outerWrapper}>
            <AnimatePresence>
                <motion.span
                    className={classes.innerWrapper}
                    key={props.one2Two}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {props.one2Two ?
                        props.one :
                        props.two
                    }
                </motion.span>
            </AnimatePresence>
        </div>
    );
}