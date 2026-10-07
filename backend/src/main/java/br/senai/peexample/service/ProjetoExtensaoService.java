package br.senai.peexample.service;

import br.senai.peexample.dto.ProjetoExtensaoCreateDTO;
import br.senai.peexample.dto.ProjetoExtensaoDTO;
import br.senai.peexample.exception.BusinessException;
import br.senai.peexample.exception.ResourceNotFoundException;
import br.senai.peexample.model.ProjetoExtensao;
import br.senai.peexample.model.StatusProjeto;
import br.senai.peexample.model.StatusUsuario;
import br.senai.peexample.model.Usuario;
import br.senai.peexample.repository.ProjetoExtensaoRepository;
import br.senai.peexample.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetoExtensaoService {

    private final ProjetoExtensaoRepository projetoExtensaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<ProjetoExtensaoDTO> listarTodos() {
        return projetoExtensaoRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjetoExtensaoDTO buscarPorId(Long id) {
        ProjetoExtensao projeto = projetoExtensaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto de extensão não encontrado com id: " + id));
        return toDTO(projeto);
    }

    @Transactional
    public ProjetoExtensaoDTO criar(ProjetoExtensaoCreateDTO dto) {
        Usuario coordenador = usuarioRepository.findById(dto.getCoordenadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Coordenador não encontrado com id: " + dto.getCoordenadorId()));

        if (coordenador.getStatus() == StatusUsuario.INATIVO) {
            throw new BusinessException("O coordenador selecionado está INATIVO.");
        }

        if (dto.getDataFim() != null && dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new BusinessException("A data fim não pode ser anterior à data de início.");
        }

        ProjetoExtensao projeto = ProjetoExtensao.builder()
                .titulo(dto.getTitulo())
                .descricao(dto.getDescricao())
                .coordenador(coordenador)
                .status(dto.getStatus() != null ? dto.getStatus() : StatusProjeto.EM_ANALISE)
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .build();

        projeto = projetoExtensaoRepository.save(projeto);
        return toDTO(projeto);
    }

    @Transactional
    public ProjetoExtensaoDTO atualizar(Long id, ProjetoExtensaoCreateDTO dto) {
        ProjetoExtensao projeto = projetoExtensaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto de extensão não encontrado com id: " + id));

        Usuario coordenador = usuarioRepository.findById(dto.getCoordenadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Coordenador não encontrado com id: " + dto.getCoordenadorId()));

        if (coordenador.getStatus() == StatusUsuario.INATIVO) {
            throw new BusinessException("O coordenador selecionado está INATIVO.");
        }

        if (dto.getDataFim() != null && dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new BusinessException("A data fim não pode ser anterior à data de início.");
        }

        projeto.setTitulo(dto.getTitulo());
        projeto.setDescricao(dto.getDescricao());
        projeto.setCoordenador(coordenador);
        if (dto.getStatus() != null) {
            projeto.setStatus(dto.getStatus());
        }
        projeto.setDataInicio(dto.getDataInicio());
        projeto.setDataFim(dto.getDataFim());

        projeto = projetoExtensaoRepository.save(projeto);
        return toDTO(projeto);
    }

    @Transactional
    public void deletar(Long id) {
        ProjetoExtensao projeto = projetoExtensaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto de extensão não encontrado com id: " + id));
        projetoExtensaoRepository.delete(projeto);
    }

    public ProjetoExtensaoDTO toDTO(ProjetoExtensao projeto) {
        return ProjetoExtensaoDTO.builder()
                .id(projeto.getId())
                .titulo(projeto.getTitulo())
                .descricao(projeto.getDescricao())
                .coordenadorId(projeto.getCoordenador().getId())
                .coordenadorNome(projeto.getCoordenador().getNome())
                .status(projeto.getStatus())
                .dataInicio(projeto.getDataInicio())
                .dataFim(projeto.getDataFim())
                .dataCriacao(projeto.getDataCriacao())
                .build();
    }
}
