import { useRef } from "react";

const BackgroundGrid = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Base Background */}
            <div className="absolute inset-0 bg-black-950" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px),
                            linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                    backgroundSize: "4rem 4rem",
                }}
            />

            {/* Radial Fade Mask */}
            <div className="absolute inset-0 bg-black-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>
    );
};

export default BackgroundGrid;
