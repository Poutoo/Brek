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
  const classes = `btn ${variant === "invert" ? "btn--invert" : ""} ${reverse ? "btn--reverse" : ""} ${withLine ? "btn--with-line" : ""} ${className}`;

  const content = (
    <span className="btn-inner">
      {withLine && <span className="btn-line btn-line--start" />}
      <span className="btn-text">{children}</span>
      {withLine && <span className="btn-line btn-line--end" />}
      {icon && <span className="icon">{icon}</span>}
    </span>
  );

  if (isLink) {
    return (
      <Link href={href} className={classes}>
        {content}
        <style jsx>{buttonStyles}</style>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
      <style jsx>{buttonStyles}</style>
    </button>
  );
}

const buttonStyles = `
  .btn {
    font-family: 'NeueMontreal', 'Inter', sans-serif;
    font-size: .875rem;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 1.5rem;
    border-radius: .5rem;
    box-shadow: inset 0 0 0 1px currentColor;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    border: none;
    outline: none;
    overflow: hidden;
    position: relative;
  }

  /* Colors */
  .btn {
    background-color: #533b3b;
    color: #fffdf8;
  }
  .btn--invert {
    background-color: #fffdf8;
    color: #533b3b;
    box-shadow: inset 0 0 0 1px #fffdf8;
  }

  /* Inner Layout */
  .btn-inner {
    display: flex;
    align-items: center;
    transition: all 0.6s cubic-bezier(0.7, 0, 0.3, 1);
  }

  .btn-line {
    width: 30px;
    height: 1px;
    background-color: currentColor;
    flex-shrink: 0;
    transition: all 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  }

  .btn-line--start {
    margin-right: 0.75rem;
    opacity: 1;
    transform: translateX(0);
  }

  .btn-line--end {
    margin-left: 0.75rem;
    opacity: 0;
    transform: translateX(-20px);
    width: 0;
  }

  .btn-text {
    white-space: nowrap;
    transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  }

  /* Animation au survol */
  .btn--with-line:hover .btn-line--start {
    opacity: 0;
    transform: translateX(20px);
    width: 0;
    margin-right: 0;
  }

  .btn--with-line:hover .btn-line--end {
    opacity: 1;
    transform: translateX(0);
    width: 30px;
    margin-left: 0.75rem;
  }

  .btn--with-line:hover .btn-text {
    /* Le texte se décale légèrement pour compenser la disparition de la marge gauche */
    transform: translateX(-10px);
  }

  /* Hover Effects */
  .btn:hover {
    box-shadow: inset 0 0 0 1px currentColor, 0 8px 25px rgba(0,0,0,0.15);
  }

  .btn--invert:hover {
    background-color: #fcf9f2;
  }

  /* Icons */
  .icon {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
  }
  .btn:hover .icon {
    transform: translateX(4px);
  }

  /* Mobile */
  @media (max-width: 768px) {
    .btn {
      padding: 0.875rem 1.25rem;
      font-size: 0.8125rem;
    }
  }
`;
