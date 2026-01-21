
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award, Lightbulb } from 'lucide-react';
import { rtoService } from '../services/geminiService';

const MockTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const handleOptionSelect = async (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const correct = QUIZ_QUESTIONS[currentQuestion].correctAnswer === index;
    if (correct) setScore(score + 1);

    // Fetch AI explanation
    setLoadingExplanation(true);
    const expl = await rtoService.generateMockTestExplanation(
      QUIZ_QUESTIONS[currentQuestion].question,
      QUIZ_QUESTIONS[currentQuestion].options[index],
      QUIZ_QUESTIONS[currentQuestion].options[QUIZ_QUESTIONS[currentQuestion].correctAnswer]
    );
    setExplanation(expl);
    setLoadingExplanation(false);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setExplanation(null);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setExplanation(null);
  };

  if (showResults) {
    const passed = score >= QUIZ_QUESTIONS.length * 0.6;
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in zoom-in duration-300">
        <div className={`inline-flex items-center justify-center p-8 rounded-full mb-8 ${passed ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950 text-rose-400 border border-rose-900/30'}`}>
          <Award className="w-24 h-24" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{passed ? 'Qualified' : 'Requires Re-Trial'}</h2>
        <p className="text-xl text-slate-400 mb-10 font-medium">
          Performance Metric: <span className="font-black text-indigo-400 uppercase tracking-widest">{score} / {QUIZ_QUESTIONS.length}</span>
        </p>
        <button
          onClick={resetTest}
          className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 mx-auto hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <RotateCcw className="h-5 w-5" /> Retake Mock Session
        </button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
            Q{currentQuestion + 1}
          </div>
          <div className="w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Score: <span className="text-indigo-400">{score}</span>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-10">
        <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
          {q.question}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((option, idx) => {
            const isCorrect = idx === q.correctAnswer;
            const isSelected = idx === selectedOption;
            
            let btnStyle = "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white";
            if (isAnswered) {
              if (isCorrect) btnStyle = "bg-emerald-950 border-emerald-600 text-emerald-400 ring-4 ring-emerald-900/20";
              else if (isSelected) btnStyle = "bg-rose-950 border-rose-600 text-rose-400 ring-4 ring-rose-900/20";
              else btnStyle = "bg-slate-950 border-slate-900 text-slate-600 opacity-40";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionSelect(idx)}
                className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left font-bold text-sm ${btnStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-10 animate-in slide-in-from-top duration-300">
            <div className="bg-indigo-950/20 p-8 rounded-[2rem] border border-indigo-900/30 space-y-4">
              <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.2em] text-xs mb-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI Behavioral Coaching</span>
              </div>
              {loadingExplanation ? (
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <p className="text-slate-200 leading-relaxed text-sm font-medium italic">
                  {explanation}
                </p>
              )}
            </div>
            
            <button
              onClick={nextQuestion}
              className="mt-8 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20"
            >
              {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Terminate Session' : 'Proceed to Next Sequence'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTest;
