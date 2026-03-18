export interface BiasDefinition {
  id: string;
  name: string;
  definition: string;
  example: string;
  lever: string;
}

export const BIASES: BiasDefinition[] = [
  {
    id: "ancrage",
    name: "Biais d'ancrage",
    definition: "La première information reçue influence disproportionnellement le jugement.",
    example: "Si tu annonces que ta solution a permis à un client de gagner 200K€, tout prix inférieur à 200K€ paraîtra raisonnable.",
    lever: "Toujours commencer par la valeur créée avant de parler de prix.",
  },
  {
    id: "confirmation",
    name: "Biais de confirmation",
    definition: "On cherche (et on trouve) les informations qui confirment ce qu'on croit déjà.",
    example: "Un investisseur qui a déjà un \"bon feeling\" (Système 1) va chercher dans ton pitch les éléments qui confirment son intuition.",
    lever: "Identifier les croyances préalables de ton interlocuteur et s'appuyer dessus.",
  },
  {
    id: "preuve_sociale",
    name: "Biais de preuve sociale",
    definition: "On se fie au comportement des autres pour décider.",
    example: "\"3 startups de la promo précédente utilisent déjà notre solution\" est plus puissant que n'importe quel argument technique.",
    lever: "Toujours avoir des témoignages, des logos, des références — même modestes.",
  },
  {
    id: "aversion_perte",
    name: "Biais d'aversion à la perte",
    definition: "La douleur de perdre est 2x plus forte que le plaisir de gagner (Kahneman & Tversky).",
    example: "\"Sans cette solution, tu perds 3h/jour de productivité\" est plus impactant que \"Avec cette solution, tu gagnes 3h/jour\".",
    lever: "Mettre en lumière ce que l'interlocuteur PERD en ne changeant pas (coût de l'inaction).",
  },
  {
    id: "statu_quo",
    name: "Biais du statu quo",
    definition: "Préférence naturelle pour la situation actuelle, même si elle est sous-optimale.",
    example: "Tes prospects utilisent déjà Excel/un process manuel. Ils préféreront le garder par défaut, même si ta solution est meilleure.",
    lever: "Réduire le coût perçu du changement (migration facile, accompagnement, essai gratuit).",
  },
  {
    id: "halo",
    name: "Effet de halo",
    definition: "Une impression positive dans un domaine influence le jugement dans les autres domaines.",
    example: "Si ton pitch est impeccable et professionnel, l'investisseur supposera que ton produit l'est aussi.",
    lever: "Soigner CHAQUE point de contact (email, LinkedIn, présentation, démo).",
  },
  {
    id: "rarete",
    name: "Biais de rareté/urgence",
    definition: "Ce qui est rare ou limité dans le temps est perçu comme plus désirable.",
    example: "\"Nous prenons seulement 5 bêta-testeurs ce trimestre\" crée plus d'engagement que \"Inscrivez-vous quand vous voulez\".",
    lever: "Créer de vraies contraintes de capacité (pas artificielles) et les communiquer.",
  },
  {
    id: "reciprocite",
    name: "Biais de réciprocité",
    definition: "Quand quelqu'un nous donne quelque chose, on se sent obligé de rendre.",
    example: "Offrir un audit gratuit, un contenu de valeur, une introduction → crée une obligation implicite.",
    lever: "Donner de la valeur AVANT de demander quoi que ce soit.",
  },
];
