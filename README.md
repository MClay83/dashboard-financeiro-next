# Dashboard Financeiro Interativo

Um dashboard financeiro interativo desenvolvido com Next.js, Shadcn UI e MySQL, que apresenta os principais KPIs (Key Performance Indicators) financeiros e gráficos dinâmicos para análise de dados.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Financeiro+Preview)

## 📊 Funcionalidades

- **KPIs Principais**:
  - Receita total
  - Despesas totais
  - Lucro líquido
  - Margem de lucro
  - Crescimento mensal da receita
  - Saldo em caixa atual

- **Filtros Interativos**:
  - Por data (dia, mês, ano e período personalizado)
  - Por categorias (vendas, despesas operacionais, etc.)

- **Gráficos Dinâmicos**:
  - Gráfico de barras para receitas vs despesas mensais
  - Gráfico de pizza para distribuição de despesas por categoria

- **Interface Responsiva**:
  - Layout adaptado para dispositivos desktop e mobile
  - Cards de destaque para KPIs principais
  - Paleta de cores profissional

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [Next.js](https://nextjs.org/) - Framework React com renderização do lado do servidor
  - [Shadcn UI](https://ui.shadcn.com/) - Componentes UI reutilizáveis
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS para estilização
  - [Recharts](https://recharts.org/) - Biblioteca de gráficos para React

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Endpoints API serverless
  - [MySQL](https://www.mysql.com/) - Banco de dados relacional
  - [MySQL2](https://github.com/sidorares/node-mysql2) - Cliente MySQL para Node.js

- **Utilitários**:
  - [date-fns](https://date-fns.org/) - Manipulação de datas
  - [Tailwind CSS](https://tailwindcss.com/) - Estilização

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18.0.0 ou superior)
- MySQL (versão 8.0 ou superior)

### Configuração do Banco de Dados

1. Crie um banco de dados MySQL:

```sql
CREATE DATABASE dashboard_financeiro;
```

2. Execute os scripts SQL na seguinte ordem:

```bash
# Criar estrutura do banco de dados
mysql -u seu_usuario -p dashboard_financeiro < scripts/schema.sql

# Inserir dados fictícios para teste
mysql -u seu_usuario -p dashboard_financeiro < scripts/dados_teste.sql
```

### Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/MClay83/dashboard-financeiro-next.git
cd dashboard-financeiro-next
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente. Crie um arquivo `.env.local` na raiz do projeto:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=dashboard_financeiro
```

4. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

O dashboard estará disponível em `http://localhost:3000`.

## 📋 Interpretação dos KPIs

- **Receita Total**: Representa a soma de todas as entradas financeiras no período selecionado.
- **Despesas Totais**: Soma de todos os gastos e saídas financeiras no período.
- **Lucro Líquido**: Diferença entre receitas e despesas, indicando o ganho real.
- **Margem de Lucro**: Porcentagem do lucro em relação à receita total, indicando eficiência operacional.
- **Crescimento Mensal**: Variação percentual da receita em relação ao mês anterior.
- **Saldo em Caixa**: Valor total disponível em contas no momento atual.

## 🔍 Casos de Uso

- **Análise Mensal**: Filtre por mês para acompanhar tendências de receitas e despesas.
- **Comparação de Períodos**: Compare diferentes períodos para identificar sazonalidades.
- **Análise por Categoria**: Identifique quais categorias de despesas estão consumindo mais recursos.
- **Projeção de Crescimento**: Acompanhe a taxa de crescimento mensal para projeções futuras.

## 🔧 Customização

O dashboard pode ser facilmente customizado para atender a diferentes necessidades de análise financeira:

1. **Adicionar Novos KPIs**: Modifique o componente `KPICards.tsx` para incluir novos indicadores.
2. **Criar Novos Gráficos**: Adicione novos componentes de gráficos baseados no template existente.
3. **Personalizar Categorias**: Adapte as categorias no banco de dados para refletir seu modelo de negócio.

## 📈 Desempenho

O sistema foi projetado para lidar com datasets de até 100 mil registros, mantendo bom desempenho e responsividade. Consultas SQL foram otimizadas com índices apropriados.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 👨‍💻 Autor

- [MClay83](https://github.com/MClay83)

---

Feito com ❤️ e Next.js