package br.senai.peexample.service;

import br.senai.peexample.dto.UsuarioCreateDTO;
import br.senai.peexample.dto.UsuarioDTO;
import br.senai.peexample.exception.BusinessException;
import br.senai.peexample.exception.ResourceNotFoundException;
import br.senai.peexample.model.StatusUsuario;
import br.senai.peexample.model.Usuario;
import br.senai.peexample.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Page<UsuarioDTO> listarTodos(String busca, Pageable pageable) {
        Page<Usuario> usuarios = busca == null || busca.isBlank()
                ? usuarioRepository.findAll(pageable)
                : usuarioRepository.findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        busca.trim(), busca.trim(), pageable);
        return usuarios.map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        return toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO criar(UsuarioCreateDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Já existe um usuário cadastrado com o e-mail: " + dto.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .tipo(dto.getTipo())
                .status(dto.getStatus() != null ? dto.getStatus() : StatusUsuario.ATIVO)
                .build();

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO atualizar(Long id, UsuarioCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));

        if (!usuario.getEmail().equalsIgnoreCase(dto.getEmail()) && usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Já existe outro usuário cadastrado com o e-mail: " + dto.getEmail());
        }

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTipo(dto.getTipo());
        if (dto.getStatus() != null) {
            usuario.setStatus(dto.getStatus());
        }

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        usuarioRepository.delete(usuario);
    }

    public UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .tipo(usuario.getTipo())
                .status(usuario.getStatus())
                .dataCriacao(usuario.getDataCriacao())
                .build();
    }
}
