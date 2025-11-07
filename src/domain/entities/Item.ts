export class Item {
  id!: string;
  name!: string;
  type!: 'healing' | 'boost' | 'ball' | 'other';
  effect!: number; // healing amount, boost multiplier, etc.
  description?: string;
  image?: string; // chemin vers l'image dans /public/images/objets/
}