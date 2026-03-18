"use client";

const priorityStyles = {
  critique: "bg-red-100 text-red-700 border-red-200",
  important: "bg-amber-100 text-amber-700 border-amber-200",
  secondaire: "bg-gray-100 text-gray-600 border-gray-200",
};

interface BadgeProps {
  priority: "critique" | "important" | "secondaire";
  className?: string;
}

export function Badge({ priority, className = "" }: BadgeProps) {
  const labels = { critique: "Critique", important: "Important", secondaire: "Secondaire" };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${priorityStyles[priority]} ${className}`}
    >
      {labels[priority]}
    </span>
  );
}
