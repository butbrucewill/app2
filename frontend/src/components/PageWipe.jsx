import { motion } from "framer-motion";

export default function PageWipe({ children }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        data-testid="page-wipe-curtain"
        className="fixed inset-0 z-[90] bg-ink flex items-center justify-center pointer-events-none"
        style={{ transformOrigin: "bottom" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, delay: 0.15, ease: [0.76, 0, 0.24, 1] } }}
        exit={{ scaleY: 1, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
      >
        <motion.span
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/60"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { delay: 0.35, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <img src="/logo-blue.png" alt="" className="h-12 w-auto opacity-70" />
        </motion.span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.25 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        {children}
      </motion.div>
    </>
  );
}
