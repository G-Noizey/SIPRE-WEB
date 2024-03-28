package mx.edu.utez.sipre.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanBuys;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoBuys;
import mx.edu.utez.sipre.model.dto.DtoWorker;
import mx.edu.utez.sipre.model.repositories.RepoBuys;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceBuys {
    private final RepoBuys repoBuys;
    private final RepoWorker repoWorker;
    private final RepoDivision repoDivision;

    @Transactional(readOnly = true)
    public ResponseEntity<List<BeanBuys>> getAllBuys() {
        List<BeanBuys> buys = repoBuys.findAll();
        return ResponseEntity.ok().body(buys);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<BeanBuys> getBuysById(Long id) {
        Optional<BeanBuys> buysOptional = repoBuys.findById(id);
        return buysOptional.map(buys -> ResponseEntity.ok().body(buys)).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> save(DtoBuys dtoBuys) {
        try {
            // Obtener la división basada en el ID proporcionado en el DTO
            Optional<BeanDivision> optionalDivision = repoDivision.findById(dtoBuys.getIdDivision());
            if (!optionalDivision.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la división con el ID proporcionado: " + dtoBuys.getIdDivision());
            }
            BeanDivision buysDivision = optionalDivision.get();

            // Obtener el trabajador basado en el ID proporcionado en el DTO
            Optional<BeanWorker> optionalWorker = repoWorker.findById(dtoBuys.getIdWorker());
            if (!optionalWorker.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el trabajador con el ID proporcionado: " + dtoBuys.getIdWorker());
            }
            BeanWorker worker = optionalWorker.get();

            // Crear la compra sin especificar el ID
            BeanBuys buys = BeanBuys.builder()
                    .beanWorker(worker)
                    .beanDivision(buysDivision)
                    .monto(dtoBuys.getMonto())
                    .status(dtoBuys.getStatus())
                    .fecha(dtoBuys.getFecha())
                    .descripcion(dtoBuys.getDescripcion())
                    .build();

            // Guardar la compra en la base de datos y dejar que la base de datos genere automáticamente el ID
            repoBuys.save(buys);

            // Devolver una respuesta con el estado CREATED y un mensaje indicando que la compra se creó exitosamente
            return ResponseEntity.status(HttpStatus.CREATED).body("Compra creada exitosamente");
        } catch (Exception e) {
            // Manejar cualquier excepción y revertir la transacción
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al guardar la compra");
        }
    }


    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> update(DtoBuys dtoBuys) {
        try {
            // Verificar si el DTO contiene un ID válido
            Long buysId = dtoBuys.getId();
            if (buysId == null) {
                return ResponseEntity.badRequest().body("El DTO no contiene un ID válido para la compra");
            }

            // Verificar si la compra existe en la base de datos
            Optional<BeanBuys> existingBuysOptional = repoBuys.findById(buysId);
            if (existingBuysOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ninguna compra con ID: " + buysId);
            }

            // Obtener la compra existente
            BeanBuys existingBuys = existingBuysOptional.get();

            // Actualizar los campos de la compra existente con los valores del DTO
            existingBuys.setMonto(dtoBuys.getMonto());
            existingBuys.setStatus(dtoBuys.getStatus());
            existingBuys.setFecha(dtoBuys.getFecha());
            existingBuys.setDescripcion(dtoBuys.getDescripcion());

            // Guardar la compra actualizada en la base de datos
            repoBuys.save(existingBuys);

            // Devolver una respuesta con el estado OK y un mensaje indicando que la compra se actualizó exitosamente
            return ResponseEntity.ok().body("Compra actualizada exitosamente");
        } catch (Exception e) {
            // Manejar cualquier excepción y revertir la transacción
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al actualizar la compra");
        }
    }





}
