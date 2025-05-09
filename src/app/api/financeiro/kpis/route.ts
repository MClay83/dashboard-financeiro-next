import { NextResponse } from 'next/server';
import { calcularKPIs } from '@/lib/services/financeiro';
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
    
    const kpis = await calcularKPIs(filtro);
    
    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Erro ao obter KPIs:', error);
    return NextResponse.json(
      { erro: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}