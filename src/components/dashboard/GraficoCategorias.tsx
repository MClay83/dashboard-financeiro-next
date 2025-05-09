'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosGrafico, FiltroFinanceiro } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraficoCategoriasProps {
  filtro: FiltroFinanceiro;
}

export function GraficoCategorias({ filtro }: GraficoCategoriasProps) {
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
        
        const resposta = await fetch(`/api/financeiro/graficos/categorias?${params.toString()}`);
        
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
  const dadosGrafico = dados?.labels.map((label, index) => ({
    name: label,
    value: dados.datasets[0].data[index]
  })) || [];

  // Formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Personalizar tooltip
  const renderTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{formatarMoeda(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  // Renderizar legenda personalizada
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="h-3 w-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Despesas por Categoria</CardTitle>
        <CardDescription>
          Distribuição das despesas por categoria
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {carregando ? (
          <div className="w-full aspect-[1/1] max-h-[300px]">
            <Skeleton className="w-full h-full" />
          </div>
        ) : erro ? (
          <div className="w-full aspect-[1/1] max-h-[300px] flex items-center justify-center">
            <p className="text-red-500">{erro}</p>
          </div>
        ) : dadosGrafico.length === 0 ? (
          <div className="w-full aspect-[1/1] max-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </div>
        ) : (
          <div className="w-full aspect-[1/1] max-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={dados?.datasets[0].backgroundColor?.[index] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltipContent} />
                <Legend 
                  content={renderLegend}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}