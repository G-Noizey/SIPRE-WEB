package mx.edu.utez.sipre.model.repositories;

import mx.edu.utez.sipre.model.bean.BeanWorker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepoWorker extends JpaRepository<BeanWorker, Long> {
    boolean existsByEmail(String email);

    boolean existsByUserWorker(String userWorker);

    Optional<BeanWorker> findByUserWorker(String userWorker);

    Optional<BeanWorker> findByEmail(String email);
}
