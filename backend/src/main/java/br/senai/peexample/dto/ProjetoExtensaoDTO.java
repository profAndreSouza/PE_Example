package br.senai.peexample.dto;

import br.senai.peexample.model.StatusProjeto;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetoExtensaoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private Long coordenadorId;
    private String coordenadorNome;
    private StatusProjeto status;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private OffsetDateTime dataCriacao;
}
