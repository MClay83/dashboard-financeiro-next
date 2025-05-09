'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosGrafico, FiltroFinanceiro } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraficoReceitasProps {
  filtro: FiltroFinanceiro;
}

export function GraficoReceitas({ filtro }: GraficoReceitasProps) {
  const [dados, setDados] = useState<DadosGrafico | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        // Construir parâmetros de consulta a partir do filtro
        const params = new URLSearchParams();
        if (filtro.dataInicio) params.append('dataInicio', filtro.dataInicio);
        if (filtro.dataFim) params.append('dataFim', filtro.dataFim);
        if (filtro.periodo) params.append('periodo', filtro.periodo);
        if (filtro.categorias) params.append('categorias', filtro.categorias.join(','));
        
        // Definir número de meses para exibir (padrão: 6)
        params.append('meses', '6');
        
        const resposta = await fetch(`/api/financeiro/graficos/mensal?${params.toString()}`);
        
        if (!resposta.ok) {
          throw new Error('Erro ao buscar dados para o gráfico');
        }
        
        const dadosGrafico = await resposta.json();
        setDados(dadosGrafico);
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        setErro('Não foi possível carregar os dados do gráfico');
      } finally {
        setCarregando(false);
      }
    };
    
    buscarDados();
  }, [filtro]);

  // Preparar dados para o formato esperado pelo Recharts
  const dadosGrafico = dados?.labels.map((label, index) => {
    const item: any = { name: label };
    
    dados.datasets.forEach(dataset => {
      item[dataset.label] = dataset.data[index];
    });
    
    return item;
  }) || [];

  // Formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Receitas vs Despesas</CardTitle>
        <CardDescription>
          Análise mensal de receitas e despesas
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {carregando ? (
          <div className="w-full aspect-[2/1]">
            <Skeleton className="w-full h-full" />
          </div>
        ) : erro ? (
          <div className="w-full aspect-[2/1] flex items-center justify-center">
            <p className="text-red-500">{erro}</p>
          </div>
        ) : (
          <div className="w-full aspect-[2/1] h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosGrafico}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatarMoeda} />
                <Tooltip 
                  formatter={formatarMoeda} 
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Legend />
                <Bar name="Receitas" dataKey="Receitas" fill="#4ade80" />
                <Bar name="Despesas" dataKey="Despesas" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}