import { Felino, FelinoInfoBasic } from '../felinoModel/felino-model';

/**
 * @fileoverview Este arquivo contém todas as interfaces, enums e tipos de dados
 * relacionados ao domínio de Vacinas e ao processo de Vacinação.
 */

/**
 * Representa o status de um ciclo de vacinação.
 */
export enum StatusCiclo {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  ATRASADO = 'ATRASADO',
  COMPLETO = 'COMPLETO',
}

/**
 * Representa uma vacina do catálogo.
 */
export interface Vaccine {
  id: string;
  nome: string;
}

/**
 * Representa os dados necessários para criar uma nova vacina no catálogo.
 */
export interface VaccineCreate {
  nome: string;
}

/**
 * 2. DEFINIÇÃO REMOVIDA:
 * A interface 'Felino' simplificada que estava aqui foi apagada.
 */

/**
 * Representa uma única aplicação de dose de vacina.
 */
export interface AplicacaoVacina {
  id: string;
  dataAplicacao: string;
  medVet: string;
  laboratorio: string;
  lote: string;
  valorPago?: number | null;
  protocoloVacinal: {
    felino: FelinoInfoBasic; // <-- Agora usa a interface Felino completa
    vacina: Vaccine;
  };
}

/**
 * Representa o ciclo de vacinação completo para um felino e uma vacina.
 */
export interface ProtocoloVacinal {
  id: string;
  status: StatusCiclo;
  dosesNecessarias: number;
  intervaloEntreDosesEmDias: number;
  requerReforcoAnual: boolean;
  dataProximaVacina?: string | null;
  dataLembreteProximoCiclo?: string | null;
  felino: FelinoInfoBasic; // <-- Agora usa a interface Felino completa
  vacina: Vaccine;
  aplicacoes?: AplicacaoVacina[];
}

/**
 * Representa os dados necessários para registrar uma nova aplicação de vacina.
 */
export interface VaccinationCreate {
  felinoId: string;
  vacinaId: string;
  laboratorio: string;
  lote: string;
  medVet: string;
  valorPago?: number | null;
  dosesNecessarias: number;
  intervaloEntreDosesEmDias: number;
  requerReforcoAnual: boolean;
}

/**
 * Representa os dados consolidados para os cards de KPI do Dashboard.
 */
export interface VacinacaoKpis {
  aplicado: number;
  agendado: number;
  atrasados: number;
  ciclosCompletos: number;
}
