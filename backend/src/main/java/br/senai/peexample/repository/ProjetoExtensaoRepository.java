package br.senai.peexample.repository;

import br.senai.peexample.model.ProjetoExtensao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetoExtensaoRepository extends JpaRepository<ProjetoExtensao, Long> {

    List<ProjetoExtensao> findByCoordenadorId(Long coordenadorId);
}
