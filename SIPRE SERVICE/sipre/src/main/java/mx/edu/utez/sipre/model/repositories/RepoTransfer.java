package mx.edu.utez.sipre.model.repositories;

import mx.edu.utez.sipre.model.bean.BeanTransferencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepoTransfer extends JpaRepository<BeanTransferencia, Long> {
    List<BeanTransferencia> findByBeanDivisionTrans_Id(Long idDivision);
}
