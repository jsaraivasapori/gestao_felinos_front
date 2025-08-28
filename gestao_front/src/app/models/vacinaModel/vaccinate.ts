export interface VaccinetionCreate {
  felinoId: string;
  vacinaId: string;
  laboratorio: string;
  lote: string;
  medVet: string;
  valorPago: number;
  dosesNecessarias: number;
  dataProximaVacina: Date;
  intervaloEntreDosesEmDias: number | null;
  requerReforcoAnual: boolean;
}

export interface Vaccination extends VaccinetionCreate {
  id: string;
}
