"use client";
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FieldInvestigationStepProps {
  visitDate: string;
  setVisitDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

const FieldInvestigationStep = ({
  visitDate,
  setVisitDate,
  notes,
  setNotes,
}: FieldInvestigationStepProps) => {
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
        <h3 className="text-xs font-extrabold text-slate-800">Step 2: Field Investigation</h3>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">On-site GPS verification and document collection</p>
      </div>

      {/* Field Visit Date */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Field Visit Date
        </label>
        <input
          type="datetime-local"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full h-10 px-3.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors cursor-pointer"
        />
      </div>

      {/* Upload Box */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.json,.geojson"
        />
        <div 
          onClick={handleUploadClick}
          className="w-full h-24 border-2 border-dashed border-blue-200 bg-blue-50/20 hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors p-4"
        >
          <Upload className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-[10px] text-blue-600 font-extrabold">
            {fileName ? `Uploaded: ${fileName}` : "Drop GPS data / photos here or click to upload"}
          </span>
          {fileName && (
            <span className="text-[9px] text-emerald-600 font-bold mt-1">
              File ready for submission
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

export default FieldInvestigationStep;