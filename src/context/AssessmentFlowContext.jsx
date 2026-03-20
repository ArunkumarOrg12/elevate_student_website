import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AssessmentFlowContext = createContext(null);

export function AssessmentFlowProvider({ children }) {
  const [flow, setFlow] = useState({
    studentId: '',
    fullName: '',
    examCode: '',
    examConfig: null,
    cycleId: null,
    attemptId: null,
    questions: [],       // questions fetched from startAttempt
    submitResult: null,
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
      {children ?? <Outlet />}
    </AssessmentFlowContext.Provider>
  );
}

export function useAssessmentFlow() {
  const ctx = useContext(AssessmentFlowContext);
  if (!ctx) throw new Error('useAssessmentFlow must be used within AssessmentFlowProvider');
  return ctx;
}
