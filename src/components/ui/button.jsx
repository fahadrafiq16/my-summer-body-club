import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const variants = {
  default: "bg-gray-900 text-white hover:bg-gray-800",
  outline: "border border-gray-200 bg-white hover:bg-gray-50",
  ghost: "hover:bg-gray-100",
};

export function Button({
  className = "",
  variant = "default",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
