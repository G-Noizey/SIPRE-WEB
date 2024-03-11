package mx.edu.utez.sipre.model.repositories;

import mx.edu.utez.sipre.model.bean.BeanDivision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepoDivision extends JpaRepository<BeanDivision, Long> {


    Optional<Object> findByName(String name);

    Optional<Object> findBySiglas(String siglas);
}
