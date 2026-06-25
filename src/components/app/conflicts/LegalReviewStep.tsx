"use client";
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="space-y-4 font-sans">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Step 4: Legal Review</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Submit findings to legal department for review</p>
      </div>

      {/* Legal Department Dropdown */}
      <div className="space-y-1.5">
        <Label htmlFor="legalDept">
          Legal Department
        </Label>
        <Select value={legalDept} onValueChange={setLegalDept}>
          <SelectTrigger id="legalDept" className="w-full">
            <SelectValue placeholder="Select Legal Representative" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maître Jean Foka">Maître Jean Foka</SelectItem>
            <SelectItem value="Maître Alice Ndoumbe">Maître Alice Ndoumbe</SelectItem>
            <SelectItem value="Maître Pierre Ebanda">Maître Pierre Ebanda</SelectItem>
          </SelectContent>
        </Select>
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
      <div className="space-y-1.5">
        <Label htmlFor="notes">
          Notes for this step
        </Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          rows={3}
          className="flex py-3 w-full rounded-lg border border-slate-200 bg-slate-50/40 px-4 text-sm text-title transition-all placeholder:text-subtitle focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-24"
        />
      </div>
    </div>
  );
};

export default LegalReviewStep;