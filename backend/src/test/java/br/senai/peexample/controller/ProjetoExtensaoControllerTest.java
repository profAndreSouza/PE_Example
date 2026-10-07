package br.senai.peexample.controller;

import br.senai.peexample.service.ProjetoExtensaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@WebMvcTest(ProjetoExtensaoController.class)
class ProjetoExtensaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjetoExtensaoService projetoExtensaoService;

    @Test
    void listaProjetosComBuscaEPaginacao() throws Exception {
        when(projetoExtensaoService.listarTodos(eq("inclusão"), any(Pageable.class)))
                .thenReturn(Page.empty(PageRequest.of(0, 3)));

        mockMvc.perform(get("/api/projetos-extensao")
                        .param("busca", "inclusão")
                        .param("size", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.size").value(3));

        verify(projetoExtensaoService).listarTodos(eq("inclusão"), any(Pageable.class));
    }

    @Test
    void rejeitaProjetoSemCamposObrigatorios() throws Exception {
        mockMvc.perform(post("/api/projetos-extensao")
                        .contentType(APPLICATION_JSON)
                        .content("{\"titulo\":\"Sem dados\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields").exists());
    }
}
