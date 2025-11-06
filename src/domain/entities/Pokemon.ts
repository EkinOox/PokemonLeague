export class Pokemon {
  id!: string;
  name!: string;
  types!: string[];
  stats!: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  level!: number;
  currentHp!: number;
  maxHp!: number;
  moves!: string[];
}