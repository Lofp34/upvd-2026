export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Quand un investisseur te dit \"J'ai un bon feeling sur votre projet\", quel système parle ?",
    options: [
      { label: "Système 1 — Le pilote automatique", value: "systeme1" },
      { label: "Système 2 — Le pilote analytique", value: "systeme2" },
    ],
    correctAnswer: "systeme1",
    explanation: "Le \"feeling\" est une réponse émotionnelle et intuitive du Système 1. Mais attention : l'investisseur va ensuite activer son Système 2 pour analyser tes chiffres.",
  },
  {
    id: "q2",
    question: "Quand ton accompagnateur te demande ton business plan détaillé, quel système active-t-il ?",
    options: [
      { label: "Système 1 — Le pilote automatique", value: "systeme1" },
      { label: "Système 2 — Le pilote analytique", value: "systeme2" },
    ],
    correctAnswer: "systeme2",
    explanation: "L'analyse d'un business plan est un processus délibéré du Système 2. Mais si ta présentation orale a déjà convaincu son Système 1, il lira le BP avec un biais de confirmation favorable.",
  },
  {
    id: "q3",
    question: "Un early adopter s'inscrit 30 secondes après avoir vu ta landing page. Quel système a décidé ?",
    options: [
      { label: "Système 1 — Le pilote automatique", value: "systeme1" },
      { label: "Système 2 — Le pilote analytique", value: "systeme2" },
    ],
    correctAnswer: "systeme1",
    explanation: "Une décision en 30 secondes est quasi-exclusivement Système 1. Ta page a déclenché les bons signaux émotionnels et intuitifs.",
  },
];
