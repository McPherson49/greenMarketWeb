import React from "react";
import { FaLaptop } from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";

interface EventIconProps {
  icon: string; 
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-9 h-9 text-base",
  lg: "w-12 h-12 text-xl",
};

const iconSize = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function EventIcon({ icon, size = "md" }: EventIconProps) {
  return (
    <div
      className={`${sizeMap[size]} bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-700`}
    >
      {icon === "online" ? (
        <FaLaptop className={iconSize[size]} />
      ) : (
        <FaPersonWalking className={iconSize[size]} />
      )}
    </div>
  );
}