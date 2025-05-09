import { executeQuery } from '../db';
import { KPI, Transacao, FiltroFinanceiro, DadosGrafico, Categoria } from '../types';
import { format, subMonths, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Funções auxiliares para formatação
const formatarData = (data: Date): string => {
  return format(data, 'yyyy-MM-dd');
};

const formatarMes = (data: Date): string => {
  return format(data, 'MMMM yyyy', { locale: ptBR });
};

// Função para buscar todas as transações com filtros
export async function buscarTransacoes(filtro?: FiltroFinanceiro): Promise<Transacao[]> {
  try {
    let query = `
      SELECT * FROM transacoes 
      WHERE 1=1
    `;
    const params: any[] = [];

    // Aplicar filtros se fornecidos
    if (filtro?.dataInicio) {
      query += ' AND data >= ?';
      params.push(filtro.dataInicio);
    }

    if (filtro?.dataFim) {
      query += ' AND data <= ?';
      params.push(filtro.dataFim);
    }

    if (filtro?.categorias && filtro.categorias.length > 0) {
      query += ` AND categoria IN (${filtro.categorias.map(() => '?').join(',')})`;
      params.push(...filtro.categorias);
    }

    query += ' ORDER BY data DESC';

    const transacoes = await executeQuery<Transacao[]>(query, params);
    return transacoes;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
}

// Função para calcular KPIs financeiros
export async function calcularKPIs(filtro?: FiltroFinanceiro): Promise<KPI> {
  try {
    // Buscar transações com os filtros fornecidos
    const transacoes = await buscarTransacoes(filtro);

    // Calcular receitas, despesas e lucro
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const lucro = receitas - despesas;
    
    // Calcular margem de lucro (evitando divisão por zero)
    const margem = receitas > 0 ? (lucro / receitas) * 100 : 0;

    // Calcular crescimento mensal (comparando com mês anterior)
    const dataAtual = filtro?.dataFim ? new Date(filtro.dataFim) : new Date();
    const mesAnteriorInicio = formatarData(startOfMonth(subMonths(dataAtual, 1)));
    const mesAnteriorFim = formatarData(endOfMonth(subMonths(dataAtual, 1)));
    
    const transacoesMesAnterior = await buscarTransacoes({
      ...filtro,
      dataInicio: mesAnteriorInicio,
      dataFim: mesAnteriorFim
    });

    const receitasMesAnterior = transacoesMesAnterior
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const crescimento = receitasMesAnterior > 0 
      ? ((receitas - receitasMesAnterior) / receitasMesAnterior) * 100 
      : 0;

    // Buscar saldo atual
    const saldoQuery = 'SELECT SUM(saldo) as saldoTotal FROM contas';
    const [result] = await executeQuery<{saldoTotal: number}[]>(saldoQuery);
    const saldoAtual = result?.saldoTotal || 0;
    
    return {
      receitaTotal: receitas,
      despesasTotal: despesas,
      lucroLiquido: lucro,
      margemLucro: margem,
      crescimentoMensal: crescimento,
      saldoCaixaAtual: saldoAtual
    };
  } catch (error) {
    console.error('Erro ao calcular KPIs:', error);
    return {
      receitaTotal: 0,
      despesasTotal: 0,
      lucroLiquido: 0,
      margemLucro: 0,
      crescimentoMensal: 0,
      saldoCaixaAtual: 0
    };
  }
}

// Função para obter dados para o gráfico de receitas vs despesas por mês
export async function obterDadosGraficoPorMes(
  meses: number = 6, 
  filtro?: FiltroFinanceiro
): Promise<DadosGrafico> {
  try {
    const dataAtual = new Date();
    const labels: string[] = [];
    const receitasMensais: number[] = [];
    const despesasMensais: number[] = [];

    // Gerar dados para os últimos N meses
    for (let i = meses - 1; i >= 0; i--) {
      const data = subMonths(dataAtual, i);
      const mesInicio = formatarData(startOfMonth(data));
      const mesFim = formatarData(endOfMonth(data));
      
      labels.push(formatarMes(data));
      
      const transacoesMes = await buscarTransacoes({
        ...filtro,
        dataInicio: mesInicio,
        dataFim: mesFim
      });
      
      const receitasMes = transacoesMes
        .filter(t => t.tipo === 'receita')
        .reduce((sum, t) => sum + t.valor, 0);
      
      const despesasMes = transacoesMes
        .filter(t => t.tipo === 'despesa')
        .reduce((sum, t) => sum + t.valor, 0);
      
      receitasMensais.push(receitasMes);
      despesasMensais.push(despesasMes);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Receitas',
          data: receitasMensais,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        },
        {
          label: 'Despesas',
          data: despesasMensais,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
        }
      ]
    };
  } catch (error) {
    console.error('Erro ao obter dados para gráfico:', error);
    return {
      labels: [],
      datasets: []
    };
  }
}

// Função para obter dados para o gráfico de distribuição de despesas por categoria
export async function obterDadosGraficoPorCategoria(
  filtro?: FiltroFinanceiro
): Promise<DadosGrafico> {
  try {
    // Buscar transações com os filtros
    const transacoes = await buscarTransacoes(filtro);
    
    // Agrupar despesas por categoria
    const despesasPorCategoria: Record<string, number> = {};
    
    transacoes
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        if (!despesasPorCategoria[t.categoria]) {
          despesasPorCategoria[t.categoria] = 0;
        }
        despesasPorCategoria[t.categoria] += t.valor;
      });
    
    // Buscar cores das categorias
    const categorias = await buscarCategorias();
    const coresCategoria: Record<string, string> = {};
    
    categorias.forEach(c => {
      coresCategoria[c.nome] = c.cor;
    });
    
    const labels = Object.keys(despesasPorCategoria);
    const valores = labels.map(cat => despesasPorCategoria[cat]);
    const cores = labels.map(cat => coresCategoria[cat] || '#' + Math.floor(Math.random()*16777215).toString(16));
    
    return {
      labels,
      datasets: [
        {
          label: 'Despesas por Categoria',
          data: valores,
          backgroundColor: cores
        }
      ]
    };
  } catch (error) {
    console.error('Erro ao obter dados para gráfico de categorias:', error);
    return {
      labels: [],
      datasets: []
    };
  }
}

// Função para buscar categorias
export async function buscarCategorias(): Promise<Categoria[]> {
  try {
    const query = 'SELECT * FROM categorias ORDER BY nome';
    const categorias = await executeQuery<Categoria[]>(query);
    return categorias;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Função para adicionar uma transação
export async function adicionarTransacao(transacao: Omit<Transacao, 'id'>): Promise<boolean> {
  try {
    const query = `
      INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      transacao.data,
      transacao.descricao,
      transacao.valor,
      transacao.tipo,
      transacao.categoria,
      transacao.contaId
    ];
    
    await executeQuery(query, params);
    
    // Atualizar saldo da conta
    const valorAjuste = transacao.tipo === 'receita' ? transacao.valor : -transacao.valor;
    
    const updateContaQuery = `
      UPDATE contas
      SET saldo = saldo + ?
      WHERE id = ?
    `;
    
    await executeQuery(updateContaQuery, [valorAjuste, transacao.contaId]);
    
    return true;
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    return false;
  }
}