"use client";
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Map } from 'lucide-react';
import { Conflict } from './ConflictsPage';
import AssignInvestigatorStep from './AssignInvestigatorStep';
import FieldInvestigationStep from './FieldInvestigationStep';
import MediationStep from './MediationStep';
import LegalReviewStep from './LegalReviewStep';
import ResolutionDecisionStep from './ResolutionDecisionStep';
import ArchiveCaseStep from './ArchiveCaseStep';
import { Button } from '@/components/ui/button';

interface ResolutionWorkflowStepsProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: Conflict;
  onCompleteWorkflow: () => void;
}

const ResolutionWorkflowSteps = ({
  isOpen,
  onClose,
  conflict,
  onCompleteWorkflow,
}: ResolutionWorkflowStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 States
  const [investigator, setInvestigator] = useState('Inspector Alain Dimi – Available');
  const [priority, setPriority] = useState('High');
  const [notes1, setNotes1] = useState('');

  // Step 2 States
  const [visitDate, setVisitDate] = useState('');
  const [notes2, setNotes2] = useState('');

  // Step 3 States
  const [mediationDate, setMediationDate] = useState('');
  const [partiesNotified, setPartiesNotified] = useState<string[]>([]);
  const [notes3, setNotes3] = useState('');

  // Step 4 States
  const [legalDept, setLegalDept] = useState('Maître Jean Foka');
  const [notes4, setNotes4] = useState('');

  // Step 5 States
  const [decision, setDecision] = useState(`Approve - ${conflict.parcels[0] || 'CM-2847'} takes precedence`);
  const [justification, setJustification] = useState('');
  const [notes5, setNotes5] = useState('');

  // Step 6 States
  const [notes6, setNotes6] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteWorkflow();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepLabels = [
    { num: 1, name: 'Assign Investigator', label: 'Assign Investigator' },
    { num: 2, name: 'Field Investigation', label: 'Field Investigation' },
    { num: 3, name: 'Mediation', label: 'Mediation' },
    { num: 4, name: 'Legal Review', label: 'Legal Review' },
    { num: 5, name: 'Resolution Decision', label: 'Resolution Decision' },
    { num: 6, name: 'Archive Case', label: 'Archive Case' },
  ];

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AssignInvestigatorStep
            investigator={investigator}
            setInvestigator={setInvestigator}
            priority={priority}
            setPriority={setPriority}
            notes={notes1}
            setNotes={setNotes1}
          />
        );
      case 2:
        return (
          <FieldInvestigationStep
            visitDate={visitDate}
            setVisitDate={setVisitDate}
            notes={notes2}
            setNotes={setNotes2}
          />
        );
      case 3:
        return (
          <MediationStep
            mediationDate={mediationDate}
            setMediationDate={setMediationDate}
            partiesNotified={partiesNotified}
            setPartiesNotified={setPartiesNotified}
            notes={notes3}
            setNotes={setNotes3}
            parcelIds={conflict.parcels}
          />
        );
      case 4:
        return (
          <LegalReviewStep
            legalDept={legalDept}
            setLegalDept={setLegalDept}
            notes={notes4}
            setNotes={setNotes4}
          />
        );
      case 5:
        return (
          <ResolutionDecisionStep
            decision={decision}
            setDecision={setDecision}
            justification={justification}
            setJustification={setJustification}
            notes={notes5}
            setNotes={setNotes5}
            parcelIds={conflict.parcels}
          />
        );
      case 6:
        return (
          <ArchiveCaseStep
            notes={notes6}
            setNotes={setNotes6}
          />
        );
      default:
        return null;
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-9998 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Right Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[620px] bg-white z-9999 shadow-2xl flex flex-col overflow-hidden border-l border-slate-100 font-sans transition-transform duration-300 ease-out transform translate-x-0">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 leading-tight">
              Resolution Workflow — {conflict.id}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mt-1">
              <span>{conflict.type}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Map className="w-3.5 h-3.5 text-slate-400" />
              <span>{conflict.parcels.join(' · ')}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-5 border-b border-slate-50 bg-[#fafafa]/50 shrink-0">
          <div className="flex items-start justify-between w-full relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-200 z-0" />
            
            {stepLabels.map((s, idx) => {
              const stepNum = s.num;
              const isCompleted = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              
              return (
                <div 
                  key={stepNum} 
                  onClick={() => setCurrentStep(stepNum)}
                  className="flex flex-col items-center relative z-10 w-16 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {/* Step Circle */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                      isCompleted 
                        ? 'bg-[#2563eb] border-[#2563eb] text-white' 
                        : isActive 
                          ? 'bg-[#2563eb] border-[#2563eb] text-white ring-4 ring-blue-100' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    {stepNum}
                  </div>

                  {/* Step Label */}
                  <span 
                    className={`text-[9px] font-bold mt-2 text-center leading-tight select-none ${
                      isActive || isCompleted ? 'text-[#2563eb]' : 'text-slate-400'
                    }`}
                  >
                    {s.label.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderActiveStep()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
          {currentStep === 1 ? (
            <button
              onClick={handleNext}
              className="py-3.5 w-1/2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center shadow-sm"
            >
              Complete & Continue
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="w-1/2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Back
              </button>
              <Button
              className='w-1/2'
                onClick={handleNext}
              >
                {currentStep === 6 ? 'Archive Case' : 'Complete & Continue'}
              </Button>
            </div>
          )}
        </div>

      </div>
    </>,
    document.body
  );
};

export default ResolutionWorkflowSteps;