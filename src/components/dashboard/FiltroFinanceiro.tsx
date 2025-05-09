'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Categoria, FiltroFinanceiro } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FiltroFinanceiroProps {
  onFiltroChange: (filtro: FiltroFinanceiro) => void;
}

export function FiltroFinanceiroComponent({ onFiltroChange }: FiltroFinanceiroProps) {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [periodo, setPeriodo] = useState<FiltroFinanceiro['periodo']>('mes');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  
  // Buscar categorias disponíveis
  useEffect(() => {
    async function buscarCategorias() {
      try {
        const resposta = await fetch('/api/financeiro/categorias');
        if (resposta.ok) {
          const dados = await resposta.json();
          setCategorias(dados);
        }
      } catch (erro) {
        console.error('Erro ao buscar categorias:', erro);
      }
    }
    
    buscarCategorias();
  }, []);
  
  // Atualizar filtros quando os valores mudarem
  useEffect(() => {
    const filtro: FiltroFinanceiro = {
      dataInicio: dataInicio ? format(dataInicio, 'yyyy-MM-dd') : undefined,
      dataFim: dataFim ? format(dataFim, 'yyyy-MM-dd') : undefined,
      periodo,
      categorias: categoriasSelecionadas.length > 0 ? categoriasSelecionadas : undefined
    };
    
    onFiltroChange(filtro);
  }, [dataInicio, dataFim, periodo, categoriasSelecionadas, onFiltroChange]);
  
  // Manipular seleção de categorias
  const handleCategoriaSelecionada = (categoria: string, checked: boolean) => {
    if (checked) {
      setCategoriasSelecionadas(prev => [...prev, categoria]);
    } else {
      setCategoriasSelecionadas(prev => prev.filter(c => c !== categoria));
    }
  };
  
  // Limpar filtros
  const limparFiltros = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setPeriodo('mes');
    setCategoriasSelecionadas([]);
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <span className="text-sm font-medium">Período</span>
          <Select
            value={periodo || 'mes'}
            onValueChange={(value) => setPeriodo(value as FiltroFinanceiro['periodo'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Diário</SelectItem>
              <SelectItem value="mes">Mensal</SelectItem>
              <SelectItem value="ano">Anual</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {periodo === 'personalizado' && (
          <>
            <div className="space-y-2">
              <span className="text-sm font-medium">Data Inicial</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? (
                      format(dataInicio, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Data Final</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? (
                      format(dataFim, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Categorias</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
              >
                <span>
                  {categoriasSelecionadas.length
                    ? `${categoriasSelecionadas.length} selecionadas`
                    : "Selecione as categorias"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <div className="p-4 max-h-[300px] overflow-auto">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`categoria-${categoria.id}`}
                      checked={categoriasSelecionadas.includes(categoria.nome)}
                      onCheckedChange={(checked) => 
                        handleCategoriaSelecionada(categoria.nome, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`categoria-${categoria.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {categoria.nome}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="col-span-1 md:col-span-4 flex justify-end">
          <Button variant="outline" onClick={limparFiltros} className="w-full md:w-auto">
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}