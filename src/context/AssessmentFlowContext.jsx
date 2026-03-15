import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AssessmentFlowContext = createContext(null);

export function AssessmentFlowProvider() {
  const [flow, setFlow] = useState({
    studentId: '',
    fullName: '',
    examCode: '',
    examConfig: null,
    securityChecks: {},
    answers: {},
    flaggedQuestions: [],
    currentQuestion: 0,
    startTime: null,
    isSubmitted: false,
  });

  function updateFlow(patch) {
    setFlow(prev => ({ ...prev, ...patch }));
  }

  return (
    <AssessmentFlowContext.Provider value={{ flow, updateFlow }}>
      <Outlet />
    </AssessmentFlowContext.Provider>
  );
}

export function useAssessmentFlow() {
  const ctx = useContext(AssessmentFlowContext);
  if (!ctx) throw new Error('useAssessmentFlow must be used within AssessmentFlowProvider');
  return ctx;
}
