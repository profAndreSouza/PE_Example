package br.senai.peexample.service;

import br.senai.peexample.dto.UsuarioCreateDTO;
import br.senai.peexample.dto.UsuarioDTO;
import br.senai.peexample.exception.BusinessException;
import br.senai.peexample.exception.ResourceNotFoundException;
import br.senai.peexample.model.StatusUsuario;
import br.senai.peexample.model.TipoUsuario;
import br.senai.peexample.model.Usuario;
import br.senai.peexample.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private UsuarioCreateDTO usuarioCreateDTO;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1L)
                .nome("Maria Silva")
                .email("maria@senai.br")
                .tipo(TipoUsuario.PROFESSOR)
                .status(StatusUsuario.ATIVO)
                .build();

        usuarioCreateDTO = UsuarioCreateDTO.builder()
                .nome("Maria Silva")
                .email("maria@senai.br")
                .tipo(TipoUsuario.PROFESSOR)
                .status(StatusUsuario.ATIVO)
                .build();
    }

    @Test
    @DisplayName("Deve criar um usuário com sucesso quando o e-mail não existir")
    void criarUsuarioComSucesso() {
        when(usuarioRepository.existsByEmail("maria@senai.br")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioDTO resultado = usuarioService.criar(usuarioCreateDTO);

        assertNotNull(resultado);
        assertEquals("Maria Silva", resultado.getNome());
        assertEquals("maria@senai.br", resultado.getEmail());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando o e-mail já estiver cadastrado")
    void lancarExcecaoQuandoEmailDuplicado() {
        when(usuarioRepository.existsByEmail("maria@senai.br")).thenReturn(true);

        assertThrows(BusinessException.class, () -> usuarioService.criar(usuarioCreateDTO));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao buscar ID inexistente")
    void lancarExcecaoQuandoUsuarioNaoEncontrado() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> usuarioService.buscarPorId(99L));
    }
}
