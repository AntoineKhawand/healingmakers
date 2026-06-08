"use client";

import { useState, useEffect } from "react";
import { User, Check, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/lib/store/profileStore";

const COUNTRIES = [
  { value: "LB", label: "Lebanon 🇱🇧" },
  { value: "US", label: "United States 🇺🇸" },
  { value: "QA", label: "Qatar 🇶🇦" },
  { value: "CY", label: "Cyprus 🇨🇾" },
  { value: "AE", label: "UAE 🇦🇪" },
  { value: "OTHER", label: "Other" },
];

export default function ProfilePage() {
  const { profile, saved, saveProfile, clearProfile } = useProfileStore();
  const [mounted, setMounted] = useState(false);
  const [form, setForm]       = useState(profile);
  const [flash, setFlash]     = useState(false);

  useEffect(() => { setMounted(true); }, []);
  // Once mounted, sync form with persisted profile
  useEffect(() => { if (mounted) setForm(profile); }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    saveProfile(form);
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  const fields: { key: keyof typeof form; label: string; type?: string; full?: boolean }[] = [
    { key: "fullName", label: "Full Name",           type: "text",  full: true },
    { key: "email",    label: "Email Address",        type: "email" },
    { key: "phone",    label: "Phone / WhatsApp",     type: "tel" },
    { key: "address",  label: "Street Address",       type: "text",  full: true },
    { key: "city",     label: "City",                 type: "text" },
    { key: "zip",      label: "ZIP / Postal Code",    type: "text" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-dusty-rose transition-colors mb-8">
        <ChevronLeft size={16} /> Back to Account
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-dusty-rose/10 rounded-full flex items-center justify-center">
          <User size={24} className="text-dusty-rose" />
        </div>
        <div>
          <h1 className="font-playfair text-2xl font-bold text-soft-black">My Profile</h1>
          <p className="text-charcoal/55 text-sm">Saved info pre-fills your checkout automatically.</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-dusty-rose/8 border border-dusty-rose/20 rounded-2xl px-4 py-3 flex items-start gap-3 mb-6">
        <MapPin size={15} className="text-dusty-rose shrink-0 mt-0.5" />
        <p className="text-xs text-charcoal/70 leading-relaxed">
          No account or password needed. Your details are stored securely on your device and used to speed up checkout.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-sand rounded-2xl p-6">
        <p className="text-sm font-semibold text-soft-black mb-5">Personal Information</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {fields.map(({ key, label, type, full }) => (
            <div key={key} className={full ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1.5">
                {label}
              </label>
              <input
                type={type ?? "text"}
                value={mounted ? form[key] : ""}
                onChange={(e) => update(key, e.target.value)}
                placeholder={label}
                className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/30"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1.5">
              Country
            </label>
            <select
              value={mounted ? form.country : ""}
              onChange={(e) => update("country", e.target.value)}
              className="w-full border border-sand px-4 py-3 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose transition-colors"
            >
              <option value="" disabled>Select country…</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-soft-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-charcoal transition-colors"
          >
            {flash ? <><Check size={15} /> Saved!</> : "Save Profile"}
          </button>
          {saved && (
            <button
              onClick={() => { clearProfile(); setForm({ fullName: "", email: "", phone: "", address: "", city: "", country: "", zip: "" }); }}
              className="px-5 py-3.5 border border-sand text-charcoal/60 rounded-xl text-sm hover:border-red-300 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
