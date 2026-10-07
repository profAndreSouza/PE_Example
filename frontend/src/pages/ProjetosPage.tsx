import React, { useEffect, useState } from 'react';
import { ProjetoExtensao, ProjetoExtensaoCreateDTO, StatusProjeto, Usuario } from '../types';
import { apiErrorMessage, projetoService, usuarioService } from '../services/api';
import { AlertMessage } from '../components/AlertMessage';
import { DataTable } from '../components/DataTable';
import { FormModal } from '../components/FormModal';
import { PaginationControls } from '../components/PaginationControls';

export const ProjetosPage: React.FC = () => {
  const [projetos, setProjetos] = useState<ProjetoExtensao[]>([]);
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalProjetos, setTotalProjetos] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProjetoExtensaoCreateDTO>({
    titulo: '',
    descricao: '',
    coordenadorId: 0,
    status: 'EM_ANALISE',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projs, users] = await Promise.all([
        projetoService.listarTodos(pagina, busca),
        usuarioService.listarTodos(0, '', 100),
      ]);
      const coordenadoresAtivos = users.content.filter((u) => u.tipo === 'PROFESSOR' && u.status === 'ATIVO');
      setProjetos(projs.content);
      setTotalPaginas(projs.totalPages);
      setTotalProjetos(projs.totalElements);
      setProfessores(coordenadoresAtivos);
      if (coordenadoresAtivos.length > 0 && formData.coordenadorId === 0) {
        setFormData((prev) => ({ ...prev, coordenadorId: coordenadoresAtivos[0].id }));
      }
    } catch {
      setError('Erro ao carregar dados dos projetos ou professores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [pagina, busca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coordenadorId) {
      setError('Selecione um coordenador válido.');
      return;
    }
    try {
      setError(null);
      if (editingId) {
        await projetoService.atualizar(editingId, formData);
        setSuccess('Projeto atualizado com sucesso!');
      } else {
        await projetoService.criar(formData);
        setSuccess('Projeto cadastrado com sucesso!');
      }
      resetForm();
      carregarDados();
    } catch (err: unknown) {
      setError(apiErrorMessage(err, 'Erro ao salvar projeto.'));
    }
  };

  const handleEdit = (p: ProjetoExtensao) => {
    setEditingId(p.id);
    setFormOpen(true);
    setFormData({
      titulo: p.titulo,
      descricao: p.descricao,
      coordenadorId: p.coordenadorId,
      status: p.status,
      dataInicio: p.dataInicio,
      dataFim: p.dataFim || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este projeto?')) return;
    try {
      setError(null);
      await projetoService.deletar(id);
      setSuccess('Projeto removido com sucesso!');
      carregarDados();
    } catch (err: unknown) {
      setError(apiErrorMessage(err, 'Erro ao deletar projeto.'));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormOpen(false);
    setFormData({
      titulo: '',
      descricao: '',
      coordenadorId: professores.length > 0 ? professores[0].id : 0,
      status: 'EM_ANALISE',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: '',
    });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Gestão de Projetos de Extensão</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-secondary">{totalProjetos} Projetos Cadastrados</span>
          <button
            className="btn btn-primary"
            disabled={professores.length === 0}
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
          >
            Novo Projeto
          </button>
        </div>
      </div>

      {error && <AlertMessage variant="danger">{error}</AlertMessage>}
      {success && <AlertMessage variant="success">{success}</AlertMessage>}

      <FormModal
        open={formOpen}
        title={editingId ? 'Editar Projeto' : 'Novo Projeto'}
        onClose={resetForm}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="projeto-titulo">Título do Projeto</label>
            <input
              id="projeto-titulo"
              type="text"
              className="form-control"
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Inclusão Digital"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="projeto-descricao">Descrição</label>
            <textarea
              id="projeto-descricao"
              className="form-control"
              rows={3}
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição detalhada do projeto..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="projeto-coordenador">Coordenador (Professor)</label>
            <select
              id="projeto-coordenador"
              className="form-select"
              required
              value={formData.coordenadorId}
              onChange={(e) => setFormData({ ...formData, coordenadorId: Number(e.target.value) })}
            >
              <option value={0}>Selecione um Professor...</option>
              {professores.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome} ({prof.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="projeto-status">Status</label>
            <select
              id="projeto-status"
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusProjeto })}
            >
              <option value="EM_ANALISE">Em Análise</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label" htmlFor="projeto-data-inicio">Data Início</label>
              <input
                id="projeto-data-inicio"
                type="date"
                className="form-control"
                required
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label" htmlFor="projeto-data-fim">Data Fim</label>
              <input
                id="projeto-data-fim"
                type="date"
                className="form-control"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Salvar Alterações' : 'Cadastrar Projeto'}
            </button>
          </div>
        </form>
      </FormModal>

      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Lista de Projetos de Extensão</div>
            <div className="p-3">
              <input
                aria-label="Buscar projetos"
                className="form-control"
                placeholder="Buscar por título ou descrição"
                value={busca}
                onChange={(event) => {
                  setPagina(0);
                  setBusca(event.target.value);
                }}
              />
            </div>
            <div className="card-body p-0">
              <DataTable
                rows={projetos}
                loading={loading}
                emptyMessage="Nenhum projeto cadastrado."
                rowKey={(projeto) => projeto.id}
                columns={[
                  { header: 'ID', render: (projeto) => projeto.id },
                  {
                    header: 'Título',
                    render: (projeto) => (
                      <>
                        <div className="fw-semibold">{projeto.titulo}</div>
                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '250px' }}>
                          {projeto.descricao}
                        </small>
                      </>
                    ),
                  },
                  { header: 'Coordenador', render: (projeto) => projeto.coordenadorNome || `ID: ${projeto.coordenadorId}` },
                  {
                    header: 'Status',
                    render: (projeto) => (
                      <span
                        className={`badge ${
                          projeto.status === 'EM_ANDAMENTO'
                            ? 'bg-primary'
                            : projeto.status === 'CONCLUIDO'
                            ? 'bg-success'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {projeto.status}
                      </span>
                    ),
                  },
                  {
                    header: 'Início / Fim',
                    render: (projeto) => (
                      <small>{projeto.dataInicio} {projeto.dataFim ? `até ${projeto.dataFim}` : ''}</small>
                    ),
                  },
                  {
                    header: 'Ações',
                    className: 'text-end',
                    render: (projeto) => (
                      <>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(projeto)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(projeto.id)}>
                          Excluir
                        </button>
                      </>
                    ),
                  },
                ]}
              />
              <PaginationControls
                currentPage={pagina}
                totalPages={totalPaginas}
                loading={loading}
                onPageChange={setPagina}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
