'use client';

// Stepper — URL searchParams 기반 4단계 진행 표시기

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: '채용공고' },
  { number: 2, label: '프로필' },
  { number: 3, label: '분석 결과' },
  { number: 4, label: '이력서' },
];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full flex items-center justify-center gap-0 mb-8 select-none">
      {STEPS.map((step, idx) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            {/* 원형 Step */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  isCompleted
                    ? 'bg-indigo-600 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 scale-110'
                    : 'bg-gray-100 text-gray-400',
                ].join(' ')}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={[
                  'mt-1 text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-indigo-600' : isCompleted ? 'text-indigo-400' : 'text-gray-400',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>

            {/* 연결선 */}
            {!isLast && (
              <div
                className={[
                  'h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-all duration-500',
                  isCompleted ? 'bg-indigo-600' : 'bg-gray-200',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
