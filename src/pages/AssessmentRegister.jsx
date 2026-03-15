import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { useAssessmentFlow } from '../context/AssessmentFlowContext';
import { examConfigs } from '../data/mockData';

export default function AssessmentRegister() {
  const navigate = useNavigate();
  const { updateFlow } = useAssessmentFlow();

  const [form, setForm] = useState({ studentId: '', fullName: '', examCode: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.studentId.trim() || !form.fullName.trim() || !form.examCode.trim()) {
      setError('All fields are required.');
      return;
    }
    const config = examConfigs[form.examCode.trim().toUpperCase()];
    if (!config) {
      setError('Invalid exam code. Please check and try again.');
      return;
    }
    updateFlow({
      studentId: form.studentId.trim(),
      fullName: form.fullName.trim(),
      examCode: form.examCode.trim().toUpperCase(),
      examConfig: config,
    });
    navigate('/assessment/overview');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <style>{`
        @keyframes registerFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .register-enter {
          animation: registerFadeIn 0.4s ease-out forwards;
        }
        .input-focus-ring:focus {
          outline: none;
          border-color: #4F46E5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }
      `}</style>

      <div className="register-enter w-full max-w-lg">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5">
            <Shield style={{ width: 15, height: 15 }} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 tracking-wide">EmployIQ Assessment Portal</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Assessment Registration</h1>
          <p className="text-gray-500 text-sm">Verify your identity to begin the assessment</p>
        </div>

        {/* Card */}
        <div className="card p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1.5">
                Student ID
              </label>
              <input
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="e.g. STU-24512"
                className="input-focus-ring w-full bg-gray-50 border border-gray-200 rounded-[9px] px-4 py-3 text-gray-800 text-sm transition-all"
                style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1.5">
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Alex Johnson"
                className="input-focus-ring w-full bg-gray-50 border border-gray-200 rounded-[9px] px-4 py-3 text-gray-800 text-sm transition-all"
                style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
              />
            </div>

            {/* Exam Code */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1.5">
                Exam Code
              </label>
              <input
                name="examCode"
                value={form.examCode}
                onChange={handleChange}
                placeholder="e.g. CS-FINAL-2025"
                className="input-focus-ring w-full bg-gray-50 border border-gray-200 rounded-[9px] px-4 py-3 text-gray-800 text-sm transition-all"
                style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-[9px] px-4 py-3">
                <AlertCircle style={{ width: 16, height: 16 }} className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-[9px] transition-all duration-200 text-sm flex items-center justify-center gap-2 mt-2"
            >
              Continue to Assessment →
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 pt-2">
            Ensure your details match your college registration records
          </p>
        </div>
      </div>
    </div>
  );
}
