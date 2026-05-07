"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface PaymentFormProps {
  initialData?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}

export function PaymentForm({ initialData, onSubmit, onCancel, submitting = false }: PaymentFormProps) {
  const [form, setForm] = useState({
    cardNumber: initialData ? "**** **** **** " + initialData.last4 : "",
    expMonth: initialData ? initialData.expMonth.toString().padStart(2, "0") : "",
    expYear: initialData ? initialData.expYear.toString() : "",
    cvc: initialData ? "***" : "",
    isDefault: initialData?.isDefault || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="relative">
        <input 
          type="text" 
          id="cnum" 
          className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed"
          required 
          placeholder=" " 
          maxLength={19}
          disabled={!!initialData}
          value={form.cardNumber} 
          onChange={e => setForm({...form, cardNumber: e.target.value})} 
        />
        <label htmlFor="cnum" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
          Numéro de carte
        </label>
        {initialData && (
          <small className="block text-[var(--text-muted)] text-[0.7rem] mt-1">
            Le numéro de carte ne peut pas être modifié.
          </small>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <input 
            type="text" 
            id="cmm" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
            required 
            placeholder=" " 
            maxLength={2}
            value={form.expMonth} 
            onChange={e => setForm({...form, expMonth: e.target.value})} 
          />
          <label htmlFor="cmm" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            Mois (MM)
          </label>
        </div>
        <div className="relative">
          <input 
            type="text" 
            id="caa" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
            required 
            placeholder=" " 
            maxLength={2}
            value={form.expYear} 
            onChange={e => setForm({...form, expYear: e.target.value})} 
          />
          <label htmlFor="caa" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            Année (AA)
          </label>
        </div>
        <div className="relative">
          <input 
            type="text" 
            id="ccvc" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed"
            required 
            placeholder=" " 
            maxLength={3}
            disabled={!!initialData}
            value={form.cvc} 
            onChange={e => setForm({...form, cvc: e.target.value})} 
          />
          <label htmlFor="ccvc" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            CVC
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <input 
          type="checkbox" 
          id="isDefC" 
          checked={form.isDefault} 
          onChange={e => setForm({...form, isDefault: e.target.checked})} 
          className="accent-[var(--gold)] w-4.5 h-4.5 cursor-pointer" 
        />
        <label htmlFor="isDefC" className="m-0 text-[0.875rem] cursor-pointer text-[var(--text-muted)]">
          Définir comme carte par défaut
        </label>
      </div>

      <div className="mt-4 flex justify-center">
        <Button 
          type="submit" 
          withLine 
          className="w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "TRAITEMENT..." : initialData ? "MODIFIER LA CARTE" : "AJOUTER LA CARTE"}
        </Button>
      </div>
    </form>
  );
}
