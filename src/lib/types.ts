// Tipos para os dados financeiros

// Tipo para transações financeiras
export interface Transacao {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  contaId: number;
}

// Tipo para categorias
export interface Categoria {
  id: number;
  nome: string;
  tipo: 'receita' | 'despesa';
  cor: string;
}

// Tipo para contas
export interface Conta {
  id: number;
  nome: string;
  saldo: number;
}

// Tipo para os KPIs financeiros
export interface KPI {
  receitaTotal: number;
  despesasTotal: number;
  lucroLiquido: number;
  margemLucro: number;
  crescimentoMensal: number;
  saldoCaixaAtual: number;
}

// Tipo para filtros
export interface FiltroFinanceiro {
  dataInicio?: string;
  dataFim?: string;
  periodo?: 'dia' | 'mes' | 'ano' | 'personalizado';
  categorias?: string[];
}

// Tipo para dados de gráficos
export interface DadosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}