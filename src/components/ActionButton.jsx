import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { MousePointer } from "lucide-react";
import styles from "./ActionButton.module.css";

export default function ActionButton({ label }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const cursors = useMemo(() => {
    const out = [];
    const circles = [10, 60];
    const cursorsPerCircle = [2, 4];
    circles.forEach((radius, ci) => {
      const count = cursorsPerCircle[ci];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotationOutward = Math.atan2(y, x) * (180 / Math.PI);

        out.push({
          id: `cursor-${ci}-${i}`,
          finalX: x,
          finalY: y,
          delay: ci * 0.01 + i * 0.002,
          rotation: rotationOutward,
          isTrail: false,
          opacity: 1,
          scale: 1,
        });

        for (let t = 1; t <= 2; t++) {
          out.push({
            id: `cursor-${ci}-${i}-trail-${t}`,
            finalX: x,
            finalY: y,
            delay: ci * 0.01 + i * 0.002 + t * 0.008,
            rotation: rotationOutward,
            isTrail: true,
            opacity: 1 - t * 0.3,
            scale: 1 - t * 0.2,
          });
        }
      }
    });
    return out;
  }, []);

  return (
    <div
      className={styles.button}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsActive((v) => !v)}
    >
      <div className={styles.gradientOverlay} />

      <motion.div
        className={styles.pulse}
        animate={
          isHovered || isActive
            ? {
                opacity: [0, 0.6, 0],
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 20px rgba(255,255,255,0.4)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={styles.innerGlow} />

      <AnimatePresence>
        {(isHovered || isActive) && (
          <motion.div
            className={styles.cursorsRoot}
            style={{ left: "50%", top: "calc(50% - 0.5px)", transform: "translate(-50%, -50%)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {cursors.map((cursor) => (
              <motion.div
                key={cursor.id}
                className={styles.cursor}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: cursor.finalX,
                  y: cursor.finalY,
                  opacity: cursor.isTrail ? cursor.opacity : [1, 0.8, 1],
                  scale: cursor.isTrail ? cursor.scale : [1, 1.1, 1],
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.03 } }}
                transition={{
                  duration: 0.08,
                  delay: cursor.delay,
                  ease: "easeOut",
                  type: "spring",
                  damping: 25,
                  stiffness: 400,
                  opacity: {
                    duration: cursor.isTrail ? 0.08 : 2,
                    repeat: cursor.isTrail ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: cursor.isTrail ? 0.08 : 2,
                    repeat: cursor.isTrail ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <MousePointer
                  className={styles.cursorIcon}
                  style={{
                    opacity: cursor.opacity,
                    transform: `scale(${cursor.scale}) rotate(${cursor.rotation}deg)`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.label}>
        <p>{label}</p>
      </div>
    </div>
  );
}