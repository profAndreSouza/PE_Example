import axios from 'axios';
import { Usuario, UsuarioCreateDTO, ProjetoExtensao, ProjetoExtensaoCreateDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usuarioService = {
  listarTodos: () => api.get<Usuario[]>('/usuarios').then(res => res.data),
  buscarPorId: (id: number) => api.get<Usuario>(`/usuarios/${id}`).then(res => res.data),
  criar: (dados: UsuarioCreateDTO) => api.post<Usuario>('/usuarios', dados).then(res => res.data),
  atualizar: (id: number, dados: UsuarioCreateDTO) => api.put<Usuario>(`/usuarios/${id}`, dados).then(res => res.data),
  deletar: (id: number) => api.delete(`/usuarios/${id}`).then(res => res.data),
};

export const projetoService = {
  listarTodos: () => api.get<ProjetoExtensao[]>('/projetos-extensao').then(res => res.data),
  buscarPorId: (id: number) => api.get<ProjetoExtensao>(`/projetos-extensao/${id}`).then(res => res.data),
  criar: (dados: ProjetoExtensaoCreateDTO) => api.post<ProjetoExtensao>('/projetos-extensao', dados).then(res => res.data),
  atualizar: (id: number, dados: ProjetoExtensaoCreateDTO) => api.put<ProjetoExtensao>(`/projetos-extensao/${id}`, dados).then(res => res.data),
  deletar: (id: number) => api.delete(`/projetos-extensao/${id}`).then(res => res.data),
};
