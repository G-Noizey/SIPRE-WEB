package mx.edu.utez.sipre.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanTransferencia;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoTransfer;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import mx.edu.utez.sipre.model.repositories.RepoTransfer;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceTransfer {
    private final RepoDivision repoDivision;
    private final RepoWorker repoWorker;
    private final RepoTransfer repoTransfer;

    @Transactional(readOnly = true)
    public ResponseEntity<List<BeanTransferencia>> getAllTransfers() {
        List<BeanTransferencia> transfers = repoTransfer.findAll();
        return ResponseEntity.ok().body(transfers);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<BeanTransferencia> getTransferById(Long id) {
        return repoTransfer.findById(id).map(transfer -> ResponseEntity.ok().body(transfer)).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> save(DtoTransfer dtoTransfer) {
    try {
        // Obtener la división basada en el ID proporcionado en el DTO
        Optional<BeanDivision> optionalDivision = repoDivision.findById(dtoTransfer.getIdDivision());
        if (!optionalDivision.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la división con el ID proporcionado: " + dtoTransfer.getIdDivision());
        }
        BeanDivision transferDivision = optionalDivision.get();

        // Obtener el trabajador basado en el ID proporcionado en el DTO
        Optional<BeanWorker> optionalWorker = repoWorker.findById(dtoTransfer.getIdWorker());
        if (!optionalWorker.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el trabajador con el ID proporcionado: " + dtoTransfer.getIdWorker());
        }
        BeanWorker worker = optionalWorker.get();

        // Crear la transferencia sin especificar el ID
        BeanTransferencia transfer = BeanTransferencia.builder()
                .beanWorkerTrans(worker)
                .beanDivisionTrans(transferDivision)
                .monto(dtoTransfer.getMonto())
                .fecha(dtoTransfer.getFecha())
                .status(dtoTransfer.getStatus())
                .descripcion(dtoTransfer.getDescripcion())
                .build();
        // Guardar la transferencia
        repoTransfer.save(transfer);
        return ResponseEntity.ok().body("Transferencia guardada correctamente");
    } catch (Exception e) {
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al guardar la transferencia: " + e.getMessage());
    }
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> update(DtoTransfer dtoTransfer) {
        try {
            //Verificar si el DTO contiene un ID válido
            Long transferId = dtoTransfer.getId();
            if(transferId == null){
                return ResponseEntity.badRequest().body("El DTO no contiene un ID válido para la transferencia");
            }

            //Verificar si la transferencia existe en la base de datos
            Optional<BeanTransferencia> existingTransferOptional = repoTransfer.findById(transferId);
            if(existingTransferOptional.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la transferencia con el ID proporcionado: " + transferId);
            }

            //Obtener la transferencia existente
            BeanTransferencia existingTransfer = existingTransferOptional.get();

            //Actualizar los campos de la transferencia con los valores proporcionados en el DTO
            existingTransfer.setMonto(dtoTransfer.getMonto());
            existingTransfer.setFecha(dtoTransfer.getFecha());
            existingTransfer.setStatus(dtoTransfer.getStatus());
            existingTransfer.setDescripcion(dtoTransfer.getDescripcion());

            //Guardar los cambios en la base de datos
            repoTransfer.save(existingTransfer);

            //Devolver una respuesta con el estado OK y un mensaje indicando que la transferencia se actualizó correctamente
            return ResponseEntity.ok().body("Transferencia actualizada correctamente");
        } catch (Exception e) {
            //Manejar cualquier exce
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al actualizar la transferencia: " + e.getMessage());
        }}

}
