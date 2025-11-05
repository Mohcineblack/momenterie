import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: number;
}

export function CheckoutSteps({ steps, currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isUpcoming = currentStep < step.number;

        return (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step */}
            <div className="flex flex-col items-center relative">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-gray-900 text-white' : ''}
                  ${isUpcoming ? 'bg-gray-200 text-gray-600' : ''}
                  transition-all duration-300
                `}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-4 rounded-full
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  transition-all duration-300
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
