package mx.edu.utez.sipre.model.repositories;

import mx.edu.utez.sipre.model.bean.BeanWorker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepoWorker extends JpaRepository<BeanWorker, Long> {
    Optional<Object> findByUserWorker(String userWorker);

    Optional<Object> findByEmail(String email);
}
