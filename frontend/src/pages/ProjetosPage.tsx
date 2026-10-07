import React, { useEffect, useState } from 'react';
import { ProjetoExtensao, ProjetoExtensaoCreateDTO, StatusProjeto, Usuario } from '../types';
import { projetoService, usuarioService } from '../services/api';

export const ProjetosPage: React.FC = () => {
  const [projetos, setProjetos] = useState<ProjetoExtensao[]>([]);
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        projetoService.listarTodos(),
        usuarioService.listarTodos(),
      ]);
      setProjetos(projs);
      setProfessores(users.filter((u) => u.tipo === 'PROFESSOR' && u.status === 'ATIVO'));
      if (users.length > 0 && formData.coordenadorId === 0) {
        setFormData((prev) => ({ ...prev, coordenadorId: users[0].id }));
      }
    } catch (err: any) {
      setError('Erro ao carregar dados dos projetos ou professores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

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
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar projeto.';
      setError(msg);
    }
  };

  const handleEdit = (p: ProjetoExtensao) => {
    setEditingId(p.id);
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
    } catch (err: any) {
      setError('Erro ao deletar projeto.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
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
        <span className="badge bg-secondary">{projetos.length} Projetos Cadastrados</span>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible">{success}</div>}

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              {editingId ? '✏️ Editar Projeto' : '➕ Novo Projeto'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Título do Projeto</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Inclusão Digital"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição detalhada do projeto..."
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Coordenador (Professor)</label>
                  <select
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
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusProjeto })}
                  >
                    <option value="EM_ANALISE">Em Análise</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Data Início</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Data Fim</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataFim}
                      onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Projeto'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Lista de Projetos de Extensão</div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-4 text-center">Carregando projetos...</div>
              ) : projetos.length === 0 ? (
                <div className="p-4 text-center text-muted">Nenhum projeto cadastrado.</div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Coordenador</th>
                      <th>Status</th>
                      <th>Início / Fim</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projetos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>
                          <div className="fw-semibold">{p.titulo}</div>
                          <small className="text-muted d-block text-truncate" style={{ maxWidth: '250px' }}>
                            {p.descricao}
                          </small>
                        </td>
                        <td>{p.coordenadorNome || `ID: ${p.coordenadorId}`}</td>
                        <td>
                          <span
                            className={`badge ${
                              p.status === 'EM_ANDAMENTO'
                                ? 'bg-primary'
                                : p.status === 'CONCLUIDO'
                                ? 'bg-success'
                                : p.status === 'CANCELADO'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <small>
                            {p.dataInicio} {p.dataFim ? `até ${p.dataFim}` : ''}
                          </small>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
