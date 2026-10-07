package br.senai.peexample.controller;

import br.senai.peexample.dto.ProjetoExtensaoCreateDTO;
import br.senai.peexample.dto.ProjetoExtensaoDTO;
import br.senai.peexample.service.ProjetoExtensaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projetos-extensao")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjetoExtensaoController {

    private final ProjetoExtensaoService projetoExtensaoService;

    @GetMapping
    public ResponseEntity<List<ProjetoExtensaoDTO>> listarTodos() {
        return ResponseEntity.ok(projetoExtensaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetoExtensaoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(projetoExtensaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProjetoExtensaoDTO> criar(@Valid @RequestBody ProjetoExtensaoCreateDTO dto) {
        ProjetoExtensaoDTO criado = projetoExtensaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetoExtensaoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ProjetoExtensaoCreateDTO dto) {
        ProjetoExtensaoDTO atualizado = projetoExtensaoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        projetoExtensaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
