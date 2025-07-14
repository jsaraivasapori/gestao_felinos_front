// interfaces.ts
export interface FelinoCreate {
  nome: string;
  idade: number;
  raca: 'sem_raca' | 'siames' | 'persa';
  fiv: boolean;
  felv: boolean;
  pif: boolean;
  isolado: boolean; // Corrigido de 'isolamento' para 'isolado'
  observacao: string;
  dataResgate: Date; // Adicione se necessário
}

export interface Felino extends FelinoCreate {
  id: string;
}

export interface FelinoInfoBasic {
  id: string;
  nome: string;
}
