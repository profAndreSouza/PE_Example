export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR';
export type StatusUsuario = 'ATIVO' | 'INATIVO';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  status: StatusUsuario;
  dataCriacao?: string;
}

export interface Pagina<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface UsuarioCreateDTO {
  nome: string;
  email: string;
  tipo: TipoUsuario;
  status: StatusUsuario;
}

export type StatusProjeto = 'EM_ANALISE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

export interface ProjetoExtensao {
  id: number;
  titulo: string;
  descricao: string;
  coordenadorId: number;
  coordenadorNome: string;
  status: StatusProjeto;
  dataInicio: string;
  dataFim?: string;
  dataCriacao?: string;
}

export interface ProjetoExtensaoCreateDTO {
  titulo: string;
  descricao: string;
  coordenadorId: number;
  status: StatusProjeto;
  dataInicio: string;
  dataFim?: string;
}
