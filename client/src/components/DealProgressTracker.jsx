import React from 'react';

const stages = [
  'Inquiry',
  'Dealer Assigned',
  'Site Visit',
  'Negotiation',
  'Finalized'
];

export default function DealProgressTracker({ currentStage }) {
  // currentStage is a string matching one of the stages above
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="flex flex-col items-center my-6">
      <div className="flex items-center">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage}>
            <div className={`flex flex-col items-center`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${idx <= currentIndex ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                `}
              >
                {idx + 1}
              </div>
              <span className={`mt-2 text-xs font-semibold ${idx <= currentIndex ? 'text-green-700' : 'text-gray-400'}`}>
                {stage}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div className={`w-10 h-1 ${idx < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 