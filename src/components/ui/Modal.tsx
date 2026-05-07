"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "500px" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#1a1614]/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-[fadeIn_0.3s_ease-out]" 
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-card)] w-full rounded shadow-2xl relative max-h-[90vh] flex flex-col animate-[slideUp_0.4s_var(--ease-luxury)]" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-8 py-6 border-b border-[var(--divider)] flex items-center justify-between">
          <h3 className="font-serif text-2xl font-normal text-[var(--text)] m-0">{title}</h3>
          <button 
            className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer p-2 transition-colors hover:text-[var(--gold)] flex items-center justify-center" 
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </header>
        <div className="p-8 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--divider)] [&::-webkit-scrollbar-thumb]:rounded-full">
          {children}
        </div>
      </div>
    </div>
  );
}
