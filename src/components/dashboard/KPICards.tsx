'use client';

import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, PercentIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPI } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface KPICardsProps {
  dados: KPI | null;
  carregando: boolean;
}

// Formatar valores monetários em reais
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Formatar porcentagens
const formatarPorcentagem = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(valor / 100);
};

export function KPICards({ dados, carregando }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card de Receita Total */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {carregando ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatarMoeda(dados?.receitaTotal || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dados?.crescimentoMensal && dados.crescimentoMensal > 0 ? (
                  <span className="text-green-500 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    {formatarPorcentagem(dados.crescimentoMensal)} em relação ao mês anterior
                  </span>
                ) : dados?.crescimentoMensal && dados.crescimentoMensal < 0 ? (
                  <span className="text-red-500 flex items-center">
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                    {formatarPorcentagem(Math.abs(dados.crescimentoMensal))} em relação ao mês anterior
                  </span>
                ) : (
                  <span className="text-gray-500">Sem variação</span>
                )}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Card de Despesas Totais */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {carregando ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="text-2xl font-bold">
              {formatarMoeda(dados?.despesasTotal || 0)}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Card de Lucro Líquido */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {carregando ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className={`text-2xl font-bold ${dados?.lucroLiquido && dados.lucroLiquido < 0 ? 'text-red-500' : 'text-blue-500'}`}>
              {formatarMoeda(dados?.lucroLiquido || 0)}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Card de Margem de Lucro */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
          <PercentIcon className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          {carregando ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className={`text-2xl font-bold ${dados?.margemLucro && dados.margemLucro < 0 ? 'text-red-500' : 'text-purple-500'}`}>
              {formatarPorcentagem(dados?.margemLucro || 0)}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Card de Crescimento Mensal */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          {carregando ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className={`text-2xl font-bold flex items-center ${dados?.crescimentoMensal && dados.crescimentoMensal < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {dados?.crescimentoMensal && dados.crescimentoMensal > 0 ? (
                <ArrowUpIcon className="h-5 w-5 mr-1" />
              ) : dados?.crescimentoMensal && dados.crescimentoMensal < 0 ? (
                <ArrowDownIcon className="h-5 w-5 mr-1" />
              ) : null}
              {formatarPorcentagem(dados?.crescimentoMensal || 0)}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Card de Saldo em Caixa */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Saldo em Caixa</CardTitle>
          <WalletIcon className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          {carregando ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className={`text-2xl font-bold ${dados?.saldoCaixaAtual && dados.saldoCaixaAtual < 0 ? 'text-red-500' : 'text-amber-500'}`}>
              {formatarMoeda(dados?.saldoCaixaAtual || 0)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}