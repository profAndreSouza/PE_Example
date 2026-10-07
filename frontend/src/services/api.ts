import axios from 'axios';
import { Pagina, Usuario, UsuarioCreateDTO, ProjetoExtensao, ProjetoExtensaoCreateDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<{ message?: string; error?: string; fields?: Record<string, string> }>(error)) {
    return fallback;
  }

  const body = error.response?.data;
  if (body?.message) return body.message;
  if (body?.error) return body.error;
  if (body?.fields) return Object.values(body.fields).join(', ');
  return fallback;
}

export const usuarioService = {
  listarTodos: (page = 0, busca = '', size = 10) =>
    api.get<Pagina<Usuario>>('/usuarios', { params: { page, size, busca } }).then(res => res.data),
  buscarPorId: (id: number) => api.get<Usuario>(`/usuarios/${id}`).then(res => res.data),
  criar: (dados: UsuarioCreateDTO) => api.post<Usuario>('/usuarios', dados).then(res => res.data),
  atualizar: (id: number, dados: UsuarioCreateDTO) => api.put<Usuario>(`/usuarios/${id}`, dados).then(res => res.data),
  deletar: (id: number) => api.delete(`/usuarios/${id}`).then(res => res.data),
};

export const projetoService = {
  listarTodos: (page = 0, busca = '') =>
    api.get<Pagina<ProjetoExtensao>>('/projetos-extensao', { params: { page, size: 10, busca } }).then(res => res.data),
  buscarPorId: (id: number) => api.get<ProjetoExtensao>(`/projetos-extensao/${id}`).then(res => res.data),
  criar: (dados: ProjetoExtensaoCreateDTO) => api.post<ProjetoExtensao>('/projetos-extensao', dados).then(res => res.data),
  atualizar: (id: number, dados: ProjetoExtensaoCreateDTO) => api.put<ProjetoExtensao>(`/projetos-extensao/${id}`, dados).then(res => res.data),
  deletar: (id: number) => api.delete(`/projetos-extensao/${id}`).then(res => res.data),
};
