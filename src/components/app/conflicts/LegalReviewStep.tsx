"use client";
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface LegalReviewStepProps {
  legalDept: string;
  setLegalDept: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

const LegalReviewStep = ({
  legalDept,
  setLegalDept,
  notes,
  setNotes,
}: LegalReviewStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 4: Legal Review</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Submit findings to legal department for review</p>
      </div>

      {/* Legal Department Dropdown */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Legal Department
        </label>
        <div className="relative">
          <select
            value={legalDept}
            onChange={(e) => setLegalDept(e.target.value)}
            className="w-full h-10 pl-3.5 pr-8 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white appearance-none transition-colors cursor-pointer"
          >
            <option value="Maître Jean Foka">Maître Jean Foka</option>
            <option value="Maître Alice Ndoumbe">Maître Alice Ndoumbe</option>
            <option value="Maître Pierre Ebanda">Maître Pierre Ebanda</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.doc,image/*"
        />
        <div 
          onClick={handleUploadClick}
          className="w-full h-24 border-2 border-dashed border-blue-200 bg-blue-50/20 hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors p-4"
        >
          <Upload className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-[10px] text-blue-600 font-extrabold">
            {fileName ? `Uploaded: ${fileName}` : "Upload investigation findings for legal review"}
          </span>
          {fileName && (
            <span className="text-[9px] text-emerald-600 font-bold mt-1">
              Document ready for legal review
            </span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Notes for this step
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full min-h-[90px] p-3 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default LegalReviewStep;