package br.senai.peexample.dto;

import br.senai.peexample.model.StatusUsuario;
import br.senai.peexample.model.TipoUsuario;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipo;
    private StatusUsuario status;
    private OffsetDateTime dataCriacao;
}
