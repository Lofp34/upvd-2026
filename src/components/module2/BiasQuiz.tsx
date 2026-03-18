"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS } from "@/data/quizQuestions";
import { Button } from "@/components/ui/Button";

interface Props {
  startupId: string;
  onComplete: () => void;
}

export function BiasQuiz({ startupId, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const selected = answers[question.id];
  const isCorrect = selected === question.correctAnswer;

  function handleSelect(value: string) {
    if (showResult) return;
    setAnswers({ ...answers, [question.id]: value });
  }

  function handleCheck() {
    setShowResult(true);
  }

  async function handleNext() {
    setShowResult(false);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Save quiz responses
      const responses = QUIZ_QUESTIONS.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || "",
        isCorrect: answers[q.id] === q.correctAnswer,
      }));

      await fetch(`/api/startups/${startupId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      onComplete();
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-blue-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Mini-Quiz : Système 1 ou Système 2 ?</h2>
          <span className="text-brand-coral-300 text-sm">
            Question {currentQ + 1}/{QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-brand-blue-700 font-medium text-lg mb-6">
          {question.question}
        </p>

        <div className="space-y-3 mb-6">
          {question.options.map((opt) => {
            const isSelected = selected === opt.value;
            const showCorrectness = showResult && isSelected;

            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showCorrectness
                    ? isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-400 bg-red-50"
                    : isSelected
                    ? "border-brand-coral-500 bg-brand-coral-500/5"
                    : "border-gray-200 hover:border-gray-300"
                } ${showResult && opt.value === question.correctAnswer ? "border-green-500 bg-green-50" : ""}`}
              >
                <span className="text-sm font-medium text-brand-blue-700">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-6 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
            <p className={`text-sm font-medium mb-1 ${isCorrect ? "text-green-700" : "text-amber-700"}`}>
              {isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}
            </p>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <Button onClick={handleCheck} disabled={!selected}>
              Vérifier
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQ < QUIZ_QUESTIONS.length - 1 ? "Question suivante" : "Continuer"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
