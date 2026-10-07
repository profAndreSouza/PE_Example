# Modelo de Evidência de Teste

**Identificador do Teste:** `CT-00X`  
**Data da Execução:** `YYYY-MM-DD`  
**Executado por:** `Nome do Aluno`  
**Ambiente:** `Desenvolvimento Local`  

---

## 1. Objetivo do Teste
Descrever sucintamente o objetivo do teste executado.

## 2. Passos para Reprodução
1. Acessar a aplicação frontend em `http://localhost:3000`.
2. Navegar até a aba "Gestão de Usuários".
3. Preencher o formulário com o e-mail duplicado `ana.silva@senai.br`.
4. Clicar em "Cadastrar Usuário".

## 3. Resultado Esperado
O sistema deve apresentar um alerta vermelho contendo a mensagem: `"Já existe um usuário cadastrado com o e-mail: ana.silva@senai.br"`.

## 4. Resultado Obtido
[PASS / FAIL] — O alerta foi exibido conforme esperado.

## 5. Capturas de Tela / Logs
*(Insira a imagem da tela ou o log retornado da API)*
