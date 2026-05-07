"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AddressFormProps {
  initialData?: {
    label: string;
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}

export function AddressForm({ initialData, onSubmit, onCancel, submitting = false }: AddressFormProps) {
  const [form, setForm] = useState(initialData || {
    label: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "France",
    isDefault: false
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
          id="label" 
          className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
          required 
          placeholder=" " 
          value={form.label} 
          onChange={e => setForm({...form, label: e.target.value})} 
        />
        <label htmlFor="label" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
          Nom de l'adresse (ex: Bureau)
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <input 
            type="text" 
            id="fname" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
            required 
            placeholder=" " 
            value={form.firstName} 
            onChange={e => setForm({...form, firstName: e.target.value})} 
          />
          <label htmlFor="fname" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            Prénom
          </label>
        </div>
        <div className="relative">
          <input 
            type="text" 
            id="lname" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
            required 
            placeholder=" " 
            value={form.lastName} 
            onChange={e => setForm({...form, lastName: e.target.value})} 
          />
          <label htmlFor="lname" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            Nom
          </label>
        </div>
      </div>

      <div className="relative">
        <input 
          type="text" 
          id="line1" 
          className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
          required 
          placeholder=" " 
          value={form.line1} 
          onChange={e => setForm({...form, line1: e.target.value})} 
        />
        <label htmlFor="line1" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
          Adresse (Ligne 1)
        </label>
      </div>

      <div className="relative">
        <input 
          type="text" 
          id="line2" 
          className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
          placeholder=" " 
          value={form.line2 || ""} 
          onChange={e => setForm({...form, line2: e.target.value})} 
        />
        <label htmlFor="line2" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
          Complément (facultatif)
        </label>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <div className="relative">
          <input 
            type="text" 
            id="zip" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
            required 
            placeholder=" " 
            value={form.postalCode} 
            onChange={e => setForm({...form, postalCode: e.target.value})} 
          />
          <label htmlFor="zip" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            Code Postal
          </label>
        </div>
        <div className="relative">
          <input 
            type="text" 
            id="city" 
            className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
            required 
            placeholder=" " 
            value={form.city} 
            onChange={e => setForm({...form, city: e.target.value})} 
          />
          <label htmlFor="city" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
            Ville
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <input 
          type="checkbox" 
          id="isDefA" 
          checked={form.isDefault} 
          onChange={e => setForm({...form, isDefault: e.target.checked})} 
          className="accent-[var(--gold)] w-4.5 h-4.5 cursor-pointer" 
        />
        <label htmlFor="isDefA" className="m-0 text-[0.875rem] cursor-pointer text-[var(--text-muted)]">
          Définir comme adresse par défaut
        </label>
      </div>

      <div className="mt-4 flex justify-center">
        <Button 
          type="submit" 
          withLine 
          className="w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "ENREGISTREMENT..." : "ENREGISTRER L'ADRESSE"}
        </Button>
      </div>
    </form>
  );
}
