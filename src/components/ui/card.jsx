import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-background text-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 border-b px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

