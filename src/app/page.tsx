'use client';

import { useState, useEffect } from 'react';
import { FiltroFinanceiro, KPI } from '@/lib/types';
import { FiltroFinanceiroComponent } from '@/components/dashboard/FiltroFinanceiro';
import { KPICards } from '@/components/dashboard/KPICards';
import { GraficoReceitas } from '@/components/dashboard/GraficoReceitas';
import { GraficoCategorias } from '@/components/dashboard/GraficoCategorias';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const [filtro, setFiltro] = useState<FiltroFinanceiro>({
    periodo: 'mes'
  });
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [carregandoKPIs, setCarregandoKPIs] = useState(true);

  // Buscar dados de KPIs quando o filtro mudar
  useEffect(() => {
    const buscarKPIs = async () => {
      try {
        setCarregandoKPIs(true);
        
        // Construir parâmetros de consulta
        const params = new URLSearchParams();
        if (filtro.dataInicio) params.append('dataInicio', filtro.dataInicio);
        if (filtro.dataFim) params.append('dataFim', filtro.dataFim);
        if (filtro.periodo) params.append('periodo', filtro.periodo);
        if (filtro.categorias) params.append('categorias', filtro.categorias.join(','));
        
        const resposta = await fetch(`/api/financeiro/kpis?${params.toString()}`);
        
        if (!resposta.ok) {
          throw new Error('Erro ao buscar KPIs');
        }
        
        const dados = await resposta.json();
        setKpis(dados);
      } catch (error) {
        console.error('Erro ao buscar KPIs:', error);
      } finally {
        setCarregandoKPIs(false);
      }
    };
    
    buscarKPIs();
  }, [filtro]);

  return (
    <main className="flex min-h-screen flex-col gap-6 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe os principais indicadores financeiros do seu negócio
          </p>
        </div>
      </header>
      
      <div className="space-y-6">
        {/* Componente de Filtros */}
        <FiltroFinanceiroComponent onFiltroChange={setFiltro} />
        
        {/* Cards de KPIs */}
        <KPICards dados={kpis} carregando={carregandoKPIs} />
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficoReceitas filtro={filtro} />
          <GraficoCategorias filtro={filtro} />
        </div>
        
        {/* Tabs com detalhes */}
        <Tabs defaultValue="receitas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="contas">Contas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receitas" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Análise de Receitas</h3>
              <p className="text-muted-foreground">
                O dashboard apresenta a receita total de {kpis?.receitaTotal ? 
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.receitaTotal) : 
                  "R$ 0,00"
                }, com um crescimento mensal de {kpis?.crescimentoMensal ? 
                  new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(kpis.crescimentoMensal / 100) : 
                  "0%"
                } em relação ao mês anterior.
              </p>
              <p className="text-muted-foreground mt-2">
                Use o gráfico de barras para analisar a tendência mensal de receitas e identificar padrões sazonais.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="despesas" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Análise de Despesas</h3>
              <p className="text-muted-foreground">
                As despesas totais somam {kpis?.despesasTotal ? 
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.despesasTotal) : 
                  "R$ 0,00"
                }, representando {kpis?.receitaTotal && kpis.receitaTotal > 0 ? 
                  new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(kpis.despesasTotal / kpis.receitaTotal) : 
                  "0%"
                } da receita total.
              </p>
              <p className="text-muted-foreground mt-2">
                Utilize o gráfico de pizza para analisar a distribuição de despesas por categoria e identificar onde os recursos estão sendo mais consumidos.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="contas" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Saldo em Contas</h3>
              <p className="text-muted-foreground">
                O saldo atual em caixa é de {kpis?.saldoCaixaAtual ? 
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.saldoCaixaAtual) : 
                  "R$ 0,00"
                }.
              </p>
              <p className="text-muted-foreground mt-2">
                Este valor representa o saldo consolidado de todas as contas bancárias e fundos de caixa registrados no sistema.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}