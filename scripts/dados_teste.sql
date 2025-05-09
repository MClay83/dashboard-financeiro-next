-- Script para inserir dados fictícios para teste no Dashboard Financeiro
-- Execute após o script schema.sql

USE dashboard_financeiro;

-- Limpar tabelas existentes para evitar duplicações
DELETE FROM transacoes;
DELETE FROM categorias;
DELETE FROM contas;

-- Inserir categorias de receitas
INSERT INTO categorias (nome, tipo, cor) VALUES
('Vendas', 'receita', '#4ade80'),
('Investimentos', 'receita', '#22d3ee'),
('Serviços', 'receita', '#a78bfa'),
('Royalties', 'receita', '#fb7185'),
('Consultorias', 'receita', '#facc15');

-- Inserir categorias de despesas
INSERT INTO categorias (nome, tipo, cor) VALUES
('Folha de Pagamento', 'despesa', '#f87171'),
('Aluguel', 'despesa', '#fb923c'),
('Marketing', 'despesa', '#fbbf24'),
('Impostos', 'despesa', '#a3e635'),
('Material de Escritório', 'despesa', '#38bdf8'),
('Serviços de TI', 'despesa', '#c084fc'),
('Viagens', 'despesa', '#f472b6'),
('Manutenção', 'despesa', '#94a3b8');

-- Inserir contas
INSERT INTO contas (nome, saldo) VALUES
('Conta Corrente Principal', 0),
('Conta Poupança', 0),
('Conta Investimentos', 0);

-- Variáveis para ano e meses atuais (ajustar conforme necessário)
SET @ano_atual = YEAR(CURDATE());
SET @mes_atual = MONTH(CURDATE());

-- Gerar transações fictícias para os últimos 12 meses
-- Ajuste os meses conforme necessário para testes

-- Últimos 12 meses
SET @mes = @mes_atual - 11;
SET @ano = @ano_atual;
WHILE @mes <= @mes_atual DO
    -- Ajusta o ano e mês para valores válidos
    IF @mes <= 0 THEN
        SET @mes = @mes + 12;
        SET @ano = @ano - 1;
    END IF;
    
    -- Receitas mensais
    
    -- Vendas (valores crescentes ao longo dos meses)
    SET @valor_vendas = 50000 + (@mes * 2000) + RAND() * 10000;
    INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
    VALUES (
        DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-15')),
        CONCAT('Vendas do mês ', MONTHNAME(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-01'))),
        @valor_vendas,
        'receita',
        'Vendas',
        1
    );
    
    -- Investimentos (variação sazonal)
    SET @valor_investimentos = 10000 + (RAND() * 5000);
    IF @mes IN (3, 6, 9, 12) THEN -- Trimestral
        SET @valor_investimentos = @valor_investimentos * 2;
    END IF;
    
    INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
    VALUES (
        DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-10')),
        CONCAT('Retorno de investimentos - ', MONTHNAME(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-01'))),
        @valor_investimentos,
        'receita',
        'Investimentos',
        3
    );
    
    -- Serviços
    SET @valor_servicos = 30000 + (RAND() * 8000);
    INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
    VALUES (
        DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-20')),
        CONCAT('Prestação de serviços - ', MONTHNAME(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-01'))),
        @valor_servicos,
        'receita',
        'Serviços',
        1
    );
    
    -- Receitas adicionais aleatórias
    IF RAND() > 0.5 THEN
        INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
        VALUES (
            DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-', FLOOR(1 + RAND() * 28))),
            CONCAT('Consultoria especial - Cliente XYZ'),
            8000 + (RAND() * 12000),
            'receita',
            'Consultorias',
            1
        );
    END IF;
    
    -- Despesas mensais
    
    -- Folha de pagamento
    SET @valor_folha = 40000 + RAND() * 5000;
    INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
    VALUES (
        DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-05')),
        CONCAT('Folha de pagamento - ', MONTHNAME(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-01'))),
        @valor_folha,
        'despesa',
        'Folha de Pagamento',
        1
    );
    
    -- Aluguel
    INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
    VALUES (
        DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-10')),
        CONCAT('Aluguel escritório - ', MONTHNAME(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-01'))),
        12000,
        'despesa',
        'Aluguel',
        1
    );
    
    -- Marketing (variação sazonal)
    SET @valor_marketing = 15000 + (RAND() * 5000);
    IF @mes IN (11, 12, 1) THEN -- Maior no final/início do ano
        SET @valor_marketing = @valor_marketing * 1.5;
    END IF;
    
    INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
    VALUES (
        DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-15')),
        CONCAT('Campanha de marketing - ', MONTHNAME(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-01'))),
        @valor_marketing,
        'despesa',
        'Marketing',
        1
    );
    
    -- Impostos (trimestral)
    IF @mes IN (3, 6, 9, 12) THEN
        INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
        VALUES (
            DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-20')),
            CONCAT('Impostos trimestrais - Q', CEILING(@mes/3)),
            35000 + (RAND() * 5000),
            'despesa',
            'Impostos',
            1
        );
    END IF;
    
    -- Despesas adicionais aleatórias
    -- Material de escritório
    IF RAND() > 0.3 THEN
        INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
        VALUES (
            DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-', FLOOR(1 + RAND() * 28))),
            'Compra de material de escritório',
            2000 + (RAND() * 3000),
            'despesa',
            'Material de Escritório',
            1
        );
    END IF;
    
    -- Serviços de TI
    IF RAND() > 0.5 THEN
        INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
        VALUES (
            DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-', FLOOR(1 + RAND() * 28))),
            'Manutenção sistemas TI',
            5000 + (RAND() * 5000),
            'despesa',
            'Serviços de TI',
            1
        );
    END IF;
    
    -- Viagens
    IF RAND() > 0.6 THEN
        INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
        VALUES (
            DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-', FLOOR(1 + RAND() * 28))),
            'Viagem corporativa',
            8000 + (RAND() * 7000),
            'despesa',
            'Viagens',
            1
        );
    END IF;
    
    -- Manutenção
    IF RAND() > 0.7 THEN
        INSERT INTO transacoes (data, descricao, valor, tipo, categoria, contaId)
        VALUES (
            DATE(CONCAT(@ano, '-', LPAD(@mes, 2, '0'), '-', FLOOR(1 + RAND() * 28))),
            'Manutenção predial',
            3000 + (RAND() * 4000),
            'despesa',
            'Manutenção',
            1
        );
    END IF;
    
    -- Avança para o próximo mês
    SET @mes = @mes + 1;
END WHILE;

-- Atualizar saldos das contas com base nas transações
UPDATE contas c
SET c.saldo = (
    SELECT IFNULL(SUM(
        CASE 
            WHEN t.tipo = 'receita' THEN t.valor
            ELSE -t.valor
        END
    ), 0)
    FROM transacoes t
    WHERE t.contaId = c.id
);