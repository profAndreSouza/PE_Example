-- Script de População Inicial (DML / Seeds) — Módulo de Banco de Dados

INSERT INTO tb_usuario (nome, email, tipo, status) VALUES 
('Ana Maria Silva', 'ana.silva@senai.br', 'PROFESSOR', 'ATIVO'),
('Carlos Eduardo Souza', 'carlos.souza@senai.br', 'PROFESSOR', 'ATIVO'),
('Beatriz Lima', 'beatriz.lima@aluno.senai.br', 'ALUNO', 'ATIVO'),
('João Pedro Santos', 'joao.santos@aluno.senai.br', 'ALUNO', 'ATIVO'),
('Admin Sistema', 'admin@senai.br', 'ADMINISTRADOR', 'ATIVO');

INSERT INTO tb_projeto_extensao (titulo, descricao, coordenador_id, status, data_inicio, data_fim) VALUES 
('Extensão Comunitária de Inclusão Digital', 'Projeto voltado para capacitação de idosos em informática básica.', 1, 'EM_ANDAMENTO', '2026-03-01', '2026-11-30'),
('Reciclagem Tecnológica de E-Lixo', 'Coleta e recondicionamento de computadores para escolas públicas.', 2, 'EM_ANALISE', '2026-04-15', '2026-12-15');
