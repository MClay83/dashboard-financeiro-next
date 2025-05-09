import { NextResponse } from 'next/server';
import { buscarCategorias } from '@/lib/services/financeiro';

export async function GET() {
  try {
    const categorias = await buscarCategorias();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return NextResponse.json(
      { erro: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}