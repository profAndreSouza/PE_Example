package br.senai.peexample.service;

import br.senai.peexample.dto.ProjetoExtensaoCreateDTO;
import br.senai.peexample.dto.ProjetoExtensaoDTO;
import br.senai.peexample.exception.BusinessException;
import br.senai.peexample.model.ProjetoExtensao;
import br.senai.peexample.model.StatusProjeto;
import br.senai.peexample.model.StatusUsuario;
import br.senai.peexample.model.TipoUsuario;
import br.senai.peexample.model.Usuario;
import br.senai.peexample.repository.ProjetoExtensaoRepository;
import br.senai.peexample.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjetoExtensaoServiceTest {

    @Mock
    private ProjetoExtensaoRepository projetoExtensaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ProjetoExtensaoService projetoExtensaoService;

    private Usuario coordenador;
    private ProjetoExtensao projeto;
    private ProjetoExtensaoCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        coordenador = Usuario.builder()
                .id(1L)
                .nome("Prof. Roberto")
                .email("roberto@senai.br")
                .tipo(TipoUsuario.PROFESSOR)
                .status(StatusUsuario.ATIVO)
                .build();

        projeto = ProjetoExtensao.builder()
                .id(10L)
                .titulo("Robótica nas Escolas")
                .descricao("Ensino de robótica básica")
                .coordenador(coordenador)
                .status(StatusProjeto.EM_ANALISE)
                .dataInicio(LocalDate.now())
                .dataFim(LocalDate.now().plusMonths(6))
                .build();

        createDTO = ProjetoExtensaoCreateDTO.builder()
                .titulo("Robótica nas Escolas")
                .descricao("Ensino de robótica básica")
                .coordenadorId(1L)
                .status(StatusProjeto.EM_ANALISE)
                .dataInicio(LocalDate.now())
                .dataFim(LocalDate.now().plusMonths(6))
                .build();
    }

    @Test
    @DisplayName("Deve criar um projeto de extensão com sucesso")
    void criarProjetoComSucesso() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(coordenador));
        when(projetoExtensaoRepository.save(any(ProjetoExtensao.class))).thenReturn(projeto);

        ProjetoExtensaoDTO resultado = projetoExtensaoService.criar(createDTO);

        assertNotNull(resultado);
        assertEquals("Robótica nas Escolas", resultado.getTitulo());
        assertEquals("Prof. Roberto", resultado.getCoordenadorNome());
        verify(projetoExtensaoRepository, times(1)).save(any(ProjetoExtensao.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao associar coordenador inativo")
    void lancarExcecaoCoordenadorInativo() {
        coordenador.setStatus(StatusUsuario.INATIVO);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(coordenador));

        assertThrows(BusinessException.class, () -> projetoExtensaoService.criar(createDTO));
        verify(projetoExtensaoRepository, never()).save(any(ProjetoExtensao.class));
    }

    @Test
    @DisplayName("Deve devolver a página de projetos mapeada para DTO")
    void listarProjetosPaginados() {
        Pageable pageable = PageRequest.of(0, 5);
        when(projetoExtensaoRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(projeto), pageable, 1));

        Page<ProjetoExtensaoDTO> resultado = projetoExtensaoService.listarTodos("", pageable);

        assertEquals(1, resultado.getTotalElements());
        assertEquals("Robótica nas Escolas", resultado.getContent().get(0).getTitulo());
    }
}
