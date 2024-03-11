package mx.edu.utez.sipre.model.repositories;

import mx.edu.utez.sipre.model.bean.BeanBuys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoBuys extends JpaRepository<BeanBuys, Long> {
}
