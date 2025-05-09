-- Script para criação do banco de dados e tabelas para o Dashboard Financeiro
-- Executar na ordem correta para garantir as relações entre tabelas

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS dashboard_financeiro;
USE dashboard_financeiro;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    cor VARCHAR(20) NOT NULL,
    UNIQUE KEY unique_nome_tipo (nome, tipo)
);

-- Tabela de contas
CREATE TABLE IF NOT EXISTS contas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    saldo DECIMAL(15, 2) NOT NULL DEFAULT 0,
    UNIQUE KEY unique_nome (nome)
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15, 2) NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    contaId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contaId) REFERENCES contas(id)
);

-- Índices para otimizar consultas
CREATE INDEX idx_transacoes_data ON transacoes(data);
CREATE INDEX idx_transacoes_tipo ON transacoes(tipo);
CREATE INDEX idx_transacoes_categoria ON transacoes(categoria);
CREATE INDEX idx_transacoes_contaId ON transacoes(contaId);