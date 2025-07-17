export interface VoluntarioCreate {
  nome: string;
  telefone: string;
  turno: 'matutino' | 'vespertino' | 'noturno';
  largadouro: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export interface Voluntario extends VoluntarioCreate {
  id: string;
}
