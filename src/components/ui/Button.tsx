"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "invert";
  reverse?: boolean;
  className?: string;
  icon?: React.ReactNode;
  withLine?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  href,
  onClick,
  variant = "default",
  reverse = false,
  className = "",
  icon,
  withLine = false,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const isLink = !!href;
  
  const baseClasses = "group relative inline-flex items-center justify-center px-6 py-4 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer no-underline border-none outline-none overflow-hidden select-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_0_0_1px_currentColor] hover:shadow-[inset_0_0_0_1px_currentColor,0_8px_25px_rgba(0,0,0,0.15)]";
  
  const variantClasses = variant === "invert" 
    ? "bg-[#fffdf8] text-[#533b3b] hover:bg-[#fcf9f2] shadow-[inset_0_0_0_1px_#fffdf8]" 
    : "bg-[#533b3b] text-[#fffdf8]";
    
  const classes = `${baseClasses} ${variantClasses} ${className}`;

  const content = (
    <span className="flex items-center transition-all duration-600 ease-[cubic-bezier(0.7,0,0.3,1)]">
      {withLine && (
        <span className="h-px w-[30px] bg-current shrink-0 mr-3 transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] opacity-100 translate-x-0 group-hover:opacity-0 group-hover:translate-x-5 group-hover:w-0 group-hover:mr-0" />
      )}
      <span className={`whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] ${withLine ? "group-hover:-translate-x-2.5" : ""}`}>
        {children}
      </span>
      {withLine && (
        <span className="h-px w-0 bg-current shrink-0 ml-0 transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-[30px] group-hover:ml-3" />
      )}
      {icon && (
        <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1 ml-2">
          {icon}
        </span>
      )}
    </span>
  );

  if (isLink) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
