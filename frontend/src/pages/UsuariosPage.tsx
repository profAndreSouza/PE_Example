import React, { useEffect, useState } from 'react';
import { Usuario, UsuarioCreateDTO, TipoUsuario, StatusUsuario } from '../types';
import { usuarioService } from '../services/api';

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UsuarioCreateDTO>({
    nome: '',
    email: '',
    tipo: 'PROFESSOR',
    status: 'ATIVO',
  });

  const carregandoUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.listarTodos();
      setUsuarios(data);
    } catch (err: any) {
      setError('Erro ao carregar lista de usuários. Verifique se o backend está em execução.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregandoUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await usuarioService.atualizar(editingId, formData);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        await usuarioService.criar(formData);
        setSuccess('Usuário cadastrado com sucesso!');
      }
      resetForm();
      carregandoUsuarios();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar usuário.';
      setError(msg);
    }
  };

  const handleEdit = (user: Usuario) => {
    setEditingId(user.id);
    setFormData({
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      status: user.status,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      setError(null);
      await usuarioService.deletar(id);
      setSuccess('Usuário removido com sucesso!');
      carregandoUsuarios();
    } catch (err: any) {
      setError('Erro ao deletar usuário.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nome: '', email: '', tipo: 'PROFESSOR', status: 'ATIVO' });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👥 Gestão de Usuários</h2>
        <span className="badge bg-secondary">{usuarios.length} Usuários Cadastrados</span>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible">{success}</div>}

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-bold">
              {editingId ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="maria@senai.br"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo de Usuário</label>
                  <select
                    className="form-select"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoUsuario })}
                  >
                    <option value="ALUNO">Aluno</option>
                    <option value="PROFESSOR">Professor</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusUsuario })}
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
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
            <div className="card-header bg-white fw-bold">Lista de Usuários</div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-4 text-center">Carregando usuários...</div>
              ) : usuarios.length === 0 ? (
                <div className="p-4 text-center text-muted">Nenhum usuário cadastrado.</div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td className="fw-semibold">{u.nome}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.tipo === 'PROFESSOR' ? 'bg-info' : u.tipo === 'ADMINISTRADOR' ? 'bg-danger' : 'bg-secondary'}`}>
                            {u.tipo}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.status === 'ATIVO' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(u)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>
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
