"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [clicked, setClicked] = useState(false);
    const reducedMotion = useReducedMotion();
    const isDesktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");

    useEffect(() => {
        if (reducedMotion || !isDesktop) return;

        const move = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setVisible(true);
        };

        const down = () => setClicked(true);
        const up = () => setClicked(false);
        const leave = () => setVisible(false);
        const enter = () => setVisible(true);

        window.addEventListener("mousemove", move);
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);
        document.addEventListener("mouseleave", leave);
        document.addEventListener("mouseenter", enter);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            document.removeEventListener("mouseleave", leave);
            document.removeEventListener("mouseenter", enter);
        };
    }, [reducedMotion, isDesktop]);

    if (reducedMotion || !isDesktop) return null;

    return (
        <>
            <style jsx global>{`
        @media (min-width: 1024px) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: position.x - 16,
                    y: position.y - 16,
                    scale: clicked ? 0.8 : 1,
                    opacity: visible ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                aria-hidden="true"
            >
                <div className="w-8 h-8 rounded-full border-2 border-white" />
            </motion.div>
            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: position.x - 3,
                    y: position.y - 3,
                    opacity: visible ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.3 }}
                aria-hidden="true"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>
        </>
    );
}
