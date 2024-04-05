package mx.edu.utez.sipre.controller;


import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanTransferencia;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoTransfer;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import mx.edu.utez.sipre.model.repositories.RepoTransfer;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import mx.edu.utez.sipre.service.ServiceTransfer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transfer")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerTransfer {

    private final ServiceTransfer serviceTransfer;
    private final RepoTransfer repoTransfer;
    private final RepoWorker repoWorker;
    private final RepoDivision repoDivision;

    @GetMapping("/")
    public ResponseEntity<?> getAllTransfer() {
        return ResponseEntity.ok().body(serviceTransfer.getAllTransfers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransferById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(serviceTransfer.getTransferById(id));
    }

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody DtoTransfer dtoTransfer) {
        return ResponseEntity.ok(serviceTransfer.save(dtoTransfer));
    }

    @PutMapping("/")
    public ResponseEntity<String> update(@RequestBody DtoTransfer dtoTransfer) {
        ResponseEntity<String> responseEntity = serviceTransfer.update(dtoTransfer);
        return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/register")
    public ResponseEntity<?> saveTransferencia(@RequestParam String descripcion,
                                               @RequestParam String fecha,
                                               @RequestParam double monto,
                                               @RequestParam String status,
                                               //      @RequestParam Long nuTransferencia,
                                               @RequestParam Long idWorker,
                                               @RequestParam Long idDivision,
                                               @RequestParam MultipartFile comprobante) throws IOException {
        // Obtener la instancia de BeanWorker
        BeanWorker worker = repoWorker.findById(idWorker)
                .orElseThrow(() -> new RuntimeException("Worker not found with id: " + idWorker));

        // Verificar si el saldo es suficiente
        if (worker.getSaldo() < monto) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Saldo insuficiente");
        }

        // Actualizar el saldo del trabajador
        worker.setSaldo(worker.getSaldo() - monto);
        repoWorker.save(worker);

        // Obtener la instancia de BeanDivision
        BeanDivision division = repoDivision.findById(idDivision)
                .orElseThrow(() -> new RuntimeException("Division not found with id: " + idDivision));

        // Crear una instancia de BeanBuys y asignar los valores
        BeanTransferencia transferencia = new BeanTransferencia();
        transferencia.setDescripcion(descripcion);
        transferencia.setFecha(LocalDate.parse(fecha));
        transferencia.setMonto(monto);
        transferencia.setStatus(status);
        //transferencia.setNuTransferencia(nuTransferencia);
        transferencia.setBeanWorkerTrans(worker);
        transferencia.setBeanDivisionTrans(division);
        // Asignar el comprobante
        transferencia.setComprobante(comprobante.getBytes()); // Asumiendo que comprobante es un byte[]

        // Guardar la compra
        BeanTransferencia savedTransferencia = repoTransfer.save(transferencia);

        // Retornar la compra guardada
        return ResponseEntity.ok(savedTransferencia);
    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/{id}/comprobante")
    public ResponseEntity<byte[]> getComprobante(@PathVariable Long id) {
        return serviceTransfer.getComprobante(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllTransferencias() {
        List<BeanTransferencia> transferencias = repoTransfer.findAll();
        List<Map<String, Object>> transferenciasResponse = transferencias.stream()
                .map(transferencia -> {
                    Map<String, Object> transferenciaMap = new HashMap<>();
                    transferenciaMap.put("id", transferencia.getId());
                    transferenciaMap.put("descripcion", transferencia.getDescripcion());
                    transferenciaMap.put("fecha", transferencia.getFecha());
                    transferenciaMap.put("monto", transferencia.getMonto());
                    transferenciaMap.put("status", transferencia.getStatus());
                    transferenciaMap.put("idWorker", transferencia.getBeanWorkerTrans().getId());
                    transferenciaMap.put("idDivision", transferencia.getBeanDivisionTrans().getId());
                    return transferenciaMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(transferenciasResponse);
    }


}
