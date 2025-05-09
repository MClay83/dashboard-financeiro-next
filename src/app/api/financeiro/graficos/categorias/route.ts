import { NextResponse } from 'next/server';
import { obterDadosGraficoPorCategoria } from '@/lib/services/financeiro';
import { FiltroFinanceiro } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extrair parâmetros de filtro da URL
    const dataInicio = searchParams.get('dataInicio') || undefined;
    const dataFim = searchParams.get('dataFim') || undefined;
    const periodo = searchParams.get('periodo') as FiltroFinanceiro['periodo'] || undefined;
    const categorias = searchParams.get('categorias')?.split(',') || undefined;
    
    const filtro: FiltroFinanceiro = {
      dataInicio,
      dataFim,
      periodo,
      categorias
    };
    
    const dadosGrafico = await obterDadosGraficoPorCategoria(filtro);
    
    return NextResponse.json(dadosGrafico);
  } catch (error) {
    console.error('Erro ao obter dados para gráfico de categorias:', error);
    return NextResponse.json(
      { erro: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}