import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-12">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        
        return (
          <div key={step} className="flex-1 flex items-center group">
            <div className="flex flex-col items-center gap-2 relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                isCompleted ? "bg-blue-600 border-blue-600 text-white" : 
                isActive ? "bg-white border-blue-600 text-blue-600" : 
                "bg-white border-gray-200 text-gray-400"
              )}>
                {isCompleted ? <Check size={18} /> : index + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap",
                isActive ? "text-blue-600" : "text-gray-400"
              )}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-all",
                isCompleted ? "bg-blue-600" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
