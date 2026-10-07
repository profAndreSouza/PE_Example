import React, { useEffect, useState } from 'react';
import { Usuario, UsuarioCreateDTO, TipoUsuario, StatusUsuario } from '../types';
import { apiErrorMessage, usuarioService } from '../services/api';
import { AlertMessage } from '../components/AlertMessage';
import { DataTable } from '../components/DataTable';
import { FormModal } from '../components/FormModal';
import { PaginationControls } from '../components/PaginationControls';

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

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
      const data = await usuarioService.listarTodos(pagina, busca);
      setUsuarios(data.content);
      setTotalPaginas(data.totalPages);
      setTotalUsuarios(data.totalElements);
    } catch {
      setError('Erro ao carregar lista de usuários. Verifique se o backend está em execução.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregandoUsuarios();
  }, [pagina, busca]);

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
    } catch (err: unknown) {
      setError(apiErrorMessage(err, 'Erro ao salvar usuário.'));
    }
  };

  const handleEdit = (user: Usuario) => {
    setEditingId(user.id);
    setFormOpen(true);
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
    } catch (err: unknown) {
      setError(apiErrorMessage(err, 'Erro ao deletar usuário.'));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormOpen(false);
    setFormData({ nome: '', email: '', tipo: 'PROFESSOR', status: 'ATIVO' });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👥 Gestão de Usuários</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-secondary">{totalUsuarios} Usuários Cadastrados</span>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
          >
            Novo Usuário
          </button>
        </div>
      </div>

      {error && <AlertMessage variant="danger">{error}</AlertMessage>}
      {success && <AlertMessage variant="success">{success}</AlertMessage>}

      <FormModal
        open={formOpen}
        title={editingId ? 'Editar Usuário' : 'Novo Usuário'}
        onClose={resetForm}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="usuario-nome">Nome Completo</label>
            <input
              id="usuario-nome"
              type="text"
              className="form-control"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Maria Silva"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="usuario-email">E-mail</label>
            <input
              id="usuario-email"
              type="email"
              className="form-control"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="maria@senai.br"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="usuario-tipo">Tipo de Usuário</label>
            <select
              id="usuario-tipo"
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
            <label className="form-label" htmlFor="usuario-status">Status</label>
            <select
              id="usuario-status"
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusUsuario })}
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </button>
          </div>
        </form>
      </FormModal>

      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Lista de Usuários</div>
            <div className="p-3">
              <input
                aria-label="Buscar usuários"
                className="form-control"
                placeholder="Buscar por nome ou e-mail"
                value={busca}
                onChange={(event) => {
                  setPagina(0);
                  setBusca(event.target.value);
                }}
              />
            </div>
            <div className="card-body p-0">
              <DataTable
                rows={usuarios}
                loading={loading}
                emptyMessage="Nenhum usuário cadastrado."
                rowKey={(usuario) => usuario.id}
                columns={[
                  { header: 'ID', render: (usuario) => usuario.id },
                  { header: 'Nome', render: (usuario) => <span className="fw-semibold">{usuario.nome}</span> },
                  { header: 'E-mail', render: (usuario) => usuario.email },
                  {
                    header: 'Tipo',
                    render: (usuario) => (
                      <span className={`badge ${usuario.tipo === 'PROFESSOR' ? 'bg-info' : usuario.tipo === 'ADMINISTRADOR' ? 'bg-danger' : 'bg-secondary'}`}>
                        {usuario.tipo}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    render: (usuario) => (
                      <span className={`badge ${usuario.status === 'ATIVO' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {usuario.status}
                      </span>
                    ),
                  },
                  {
                    header: 'Ações',
                    className: 'text-end',
                    render: (usuario) => (
                      <>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(usuario)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(usuario.id)}>
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
