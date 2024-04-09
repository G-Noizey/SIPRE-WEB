package mx.edu.utez.sipre.model.repositories;

import mx.edu.utez.sipre.model.bean.BeanBuys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepoBuys extends JpaRepository<BeanBuys, Long> {

    List<BeanBuys> findByBeanDivisionIdAndStatus(Long divisionId, String status);

    List<BeanBuys> findByBeanWorkerIdAndStatus(Long trabajadorId, String status);
}
