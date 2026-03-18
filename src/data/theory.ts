// Module 1 Theory Content
export const THEORY_MODULE1 = {
  title: "Convaincre, c'est ton métier n°1",
  sections: [
    {
      type: "insight" as const,
      title: "L'insight fondateur",
      content: `En tant que fondateur de startup, tu vends en permanence. Tu vends ta vision aux accompagnateurs pour obtenir du soutien. Tu vends ton projet aux talents pour les recruter. Tu vends ta solution aux premiers utilisateurs pour les convertir. Tu vends ton potentiel aux financeurs pour lever des fonds. Tu vends ta crédibilité aux partenaires pour construire ton écosystème.`,
    },
    {
      type: "concept" as const,
      title: "La relation commerciale élargie",
      content: `La relation commerciale n'est pas une transaction ponctuelle. C'est une relation de confiance durable avec l'ensemble de tes parties prenantes. Chaque interaction est une opportunité de renforcer — ou de détruire — cette confiance.`,
    },
    {
      type: "list" as const,
      title: "Les 6 catégories de parties prenantes d'une startup",
      items: [
        { label: "Accompagnateurs", description: "Incubateurs, mentors, coaches, structures d'accompagnement (ex: UPVD)" },
        { label: "Équipe", description: "Cofondateurs, premiers salariés, freelances, stagiaires" },
        { label: "Utilisateurs/Clients", description: "Early adopters, premiers clients payants, bêta-testeurs" },
        { label: "Financeurs", description: "Business angels, fonds d'investissement, BPI, subventions publiques, banques" },
        { label: "Partenaires stratégiques", description: "Fournisseurs technologiques, distributeurs, prescripteurs, intégrateurs" },
        { label: "Écosystème", description: "Médias, communautés, associations sectorielles, élus locaux" },
      ],
    },
  ],
};

// Module 2 Theory Content - Kahneman
export const THEORY_KAHNEMAN = {
  title: "Le cerveau qui décide : Système 1 & Système 2",
  intro: "Daniel Kahneman (Prix Nobel d'économie 2002) a démontré que notre cerveau utilise deux modes de pensée pour prendre des décisions.",
  systems: [
    {
      name: "Système 1 — Le pilote automatique",
      traits: ["Rapide, instinctif, émotionnel", "Fonctionne sans effort conscient", "Prend 95% de nos décisions quotidiennes"],
      examples: "Première impression d'un interlocuteur, réaction à un prix, sentiment de confiance ou de méfiance.",
      sales: "C'est le système qui crée le \"feeling\", la connexion, la confiance immédiate.",
    },
    {
      name: "Système 2 — Le pilote analytique",
      traits: ["Lent, délibéré, logique", "Demande un effort mental conscient", "Intervient pour les décisions complexes ou inhabituelles"],
      examples: "Analyser un business plan, comparer deux offres, calculer un ROI.",
      sales: "C'est le système qui évalue les arguments, vérifie la cohérence, cherche les preuves.",
    },
  ],
  keyInsight: "La plupart des décisions de tes parties prenantes commencent par le Système 1 (émotion, intuition) et sont ensuite rationalisées par le Système 2 (logique, données). Ta stratégie de conviction doit donc adresser LES DEUX systèmes.",
  actionItems: [
    { system: "Système 1", action: "Créer la confiance, l'envie, le sentiment d'alignement" },
    { system: "Système 2", action: "Fournir les preuves, les données, la logique" },
  ],
};

// Module 3 Theory Content - Stakeholder Matrix
export const THEORY_MATRIX = {
  title: "Tes parties prenantes ne veulent pas ce que tu crois",
  sections: [
    {
      type: "insight" as const,
      title: "L'erreur classique du fondateur",
      content: "Penser que ses parties prenantes partagent ses enjeux. En réalité, chaque partie prenante a ses propres enjeux, qui sont souvent très éloignés de ceux de la startup.",
    },
    {
      type: "concept" as const,
      title: "Trois niveaux d'enjeux",
      items: [
        { label: "Enjeu apparent", description: "Ce que la partie prenante SEMBLE vouloir dans sa relation avec ta startup" },
        { label: "Enjeu profond", description: "Ce qui anime VRAIMENT cette personne dans son propre contexte professionnel/personnel" },
        { label: "Pont vers ma solution", description: "Le lien logique et émotionnel entre ton offre et son enjeu profond" },
      ],
    },
  ],
  examples: [
    {
      stakeholder: "Accompagnateur incubateur",
      apparent: "\"Aider ma startup à réussir\"",
      deep: "Démontrer le taux de survie de ses cohortes à sa tutelle universitaire, justifier les financements du programme, créer de l'emploi sur le territoire, développer sa propre carrière dans l'écosystème.",
      bridge: "\"En structurant notre démarche commerciale, nous augmentons nos chances de générer du CA rapidement, ce qui renforce les statistiques de réussite de l'incubateur et justifie les investissements de l'université dans le programme.\"",
    },
    {
      stakeholder: "Business Angel",
      apparent: "\"Investir dans un bon projet\"",
      deep: "Diversifier son portefeuille, obtenir un ROI significatif, avoir un deal flow de qualité à présenter à son réseau, vivre une aventure entrepreneuriale par procuration, défiscaliser.",
      bridge: "\"Notre traction commerciale précoce réduit le risque de votre investissement et crée une histoire de succès que vous pourrez partager avec votre réseau pour attirer d'autres co-investisseurs.\"",
    },
  ],
  perception: {
    title: "La perception des enjeux — le facteur invisible",
    points: [
      "Parfois, un enjeu est OBJECTIVEMENT critique mais la partie prenante ne le perçoit PAS comme tel (ex: une faille de sécurité que le client ne voit pas).",
      "Parfois, un enjeu est OBJECTIVEMENT mineur mais la partie prenante le perçoit comme VITAL (ex: un détail esthétique pour un dirigeant perfectionniste).",
      "Le rôle du commercial : faire émerger la conscience des enjeux réels ET s'adapter à la perception de son interlocuteur.",
    ],
  },
  helpQuestions: [
    "Quels sont les KPIs de cette personne ?",
    "À qui rend-elle des comptes ?",
    "Qu'est-ce qui la ferait promouvoir/récompenser ?",
    "Qu'est-ce qui l'empêche de dormir la nuit ?",
    "Quel est le contexte de son marché/secteur ?",
  ],
};
