-- Script de Criação das Tabelas (DDL) — Módulo de Banco de Dados

CREATE TABLE IF NOT EXISTS tb_usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    tipo VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tb_projeto_extensao (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    coordenador_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'EM_ANALISE',
    data_inicio DATE NOT NULL,
    data_fim DATE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projeto_coordenador FOREIGN KEY (coordenador_id) REFERENCES tb_usuario(id) ON DELETE RESTRICT
);

CREATE INDEX idx_usuario_email ON tb_usuario(email);
CREATE INDEX idx_projeto_coordenador ON tb_projeto_extensao(coordenador_id);
