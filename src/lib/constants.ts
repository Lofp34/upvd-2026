export const CATEGORIES = [
  { id: "accompagnateurs" as const, label: "Accompagnateurs", icon: "🧭", description: "Incubateurs, mentors, coaches, structures d'accompagnement" },
  { id: "equipe" as const, label: "Équipe", icon: "👥", description: "Cofondateurs, premiers salariés, freelances, stagiaires" },
  { id: "utilisateurs_clients" as const, label: "Utilisateurs / Clients", icon: "🎯", description: "Early adopters, premiers clients payants, bêta-testeurs" },
  { id: "financeurs" as const, label: "Financeurs", icon: "💰", description: "Business angels, fonds, BPI, subventions, banques" },
  { id: "partenaires" as const, label: "Partenaires stratégiques", icon: "🤝", description: "Fournisseurs techno, distributeurs, prescripteurs" },
  { id: "ecosysteme" as const, label: "Écosystème", icon: "🌐", description: "Médias, communautés, associations, élus locaux" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export const PRIORITIES = [
  { id: "critique" as const, label: "Critique", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-50 border-red-200" },
  { id: "important" as const, label: "Important", color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-50 border-amber-200" },
  { id: "secondaire" as const, label: "Secondaire", color: "bg-gray-400", textColor: "text-gray-600", bgLight: "bg-gray-50 border-gray-200" },
] as const;

export const SECTORS = [
  "SaaS",
  "Hardware",
  "Marketplace",
  "Service",
  "Deeptech",
  "Autre",
] as const;

export const STAGES = [
  "Idéation",
  "MVP",
  "Premiers clients",
  "Croissance",
] as const;

export const MODULES = [
  { id: 1, title: "Parties Prenantes", subtitle: "Vous vendez déjà", path: "/dashboard/module1" },
  { id: 2, title: "Biais Cognitifs", subtitle: "Pourquoi les gens disent OUI", path: "/dashboard/module2" },
  { id: 3, title: "Matrice des Enjeux", subtitle: "Les vrais enjeux", path: "/dashboard/module3" },
  { id: 4, title: "Ma Bible v1", subtitle: "Synthèse et Export", path: "/dashboard/module4" },
] as const;
