package mx.edu.utez.sipre.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanBuys;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoBuys;
import mx.edu.utez.sipre.model.repositories.RepoBuys;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceBuys {
    private final RepoBuys repoBuys;

    @Transactional(readOnly = true)
    public List<BeanBuys> getAllBuys() {
        return repoBuys.findAll();
    }

    @Transactional(readOnly = true)
    public BeanBuys getBuysById(Long id) {
        if (repoBuys.findById(id).isEmpty()) {
            throw new RuntimeException("Compra con id " + id + " no encontrada");
        }
        return repoBuys.findById(id).get();
    }

    @Transactional(rollbackFor = {Exception.class})
    public BeanBuys save(DtoBuys dtoBuys) {
        BeanWorker worker = BeanWorker.builder().id((long) dtoBuys.getIdWorker()).build();
        BeanBuys buys = BeanBuys.builder()
                .id((long) dtoBuys.getId())
                .descripcion(dtoBuys.getDescripcion())
                .fecha(dtoBuys.getFecha())
                .monto(dtoBuys.getMonto())
                .beanWorker(worker)
                .build();
        return repoBuys.save(buys);
    }

    @Transactional(rollbackFor = {Exception.class})
    public BeanBuys update(BeanBuys buys) {
        if (repoBuys.findById((long) buys.getId()).isEmpty()) {
            throw new RuntimeException("Compra con id " + buys.getId() + " no encontrada. Actualización no permitida");
        }
        return repoBuys.save(buys);
    }

    @Transactional(rollbackFor = {Exception.class})
    public void delete(Long id) {
        if (repoBuys.findById(id).isEmpty()) {
            throw new RuntimeException("Compra con id " + id + " no encontrada. Eliminación no permitida");
        }
        repoBuys.deleteById(id);
    }
}
