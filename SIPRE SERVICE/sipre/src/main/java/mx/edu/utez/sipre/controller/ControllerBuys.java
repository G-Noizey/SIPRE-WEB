package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanBuys;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoBuys;
import mx.edu.utez.sipre.model.repositories.RepoBuys;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import mx.edu.utez.sipre.service.ServiceBuys;
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
@RequestMapping("/buys")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerBuys {
    private final RepoBuys repoBuys;
    private final RepoWorker repoWorker;
    private final RepoDivision repoDivision;
    private final ServiceBuys serviceBuys;

    @GetMapping("/")
    public ResponseEntity<?> getAllBuys() {
        return ResponseEntity.ok().body(serviceBuys.getAllBuys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBuysById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(serviceBuys.getBuysById(id));
    }


    //METODO PARA AGREGAR (NOIZEY)
    @CrossOrigin(origins = {"*"})
    @PostMapping("/register")
    public ResponseEntity<?> saveCompra(@RequestParam String descripcion,
                                        @RequestParam String fecha,
                                        @RequestParam double monto,
                                        @RequestParam String status,
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
        BeanBuys compra = new BeanBuys();
        compra.setDescripcion(descripcion);
        compra.setFecha(LocalDate.parse(fecha));
        compra.setMonto(monto);
        compra.setStatus(status);
        compra.setBeanWorker(worker);
        compra.setBeanDivision(division);
        // Asignar el comprobante
        compra.setComprobante(comprobante.getBytes()); // Asumiendo que comprobante es un byte[]

        // Guardar la compra
        BeanBuys savedCompra = repoBuys.save(compra);

        // Retornar la compra guardada
        return ResponseEntity.ok(savedCompra);
    }


    //ENDPOINT PARA GETTEAR LA IMAGEN DEL COMPROBANTE EN COMPRAS (NOIZEY)
    @CrossOrigin(origins = {"*"})
    @GetMapping("/{id}/comprobante")
    public ResponseEntity<byte[]> getComprobante(@PathVariable Long id) {
        return serviceBuys.getComprobante(id);
    }


    @GetMapping("/generatePDF/{divisionId}")
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long divisionId) {
        return serviceBuys.generatePDF(divisionId);
    }


    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody DtoBuys dtoBuys) {
        return ResponseEntity.ok(serviceBuys.save(dtoBuys));
    }

    @PutMapping("/")
    public ResponseEntity<String> update(@RequestBody DtoBuys dtoBuys) {
        ResponseEntity<String> responseEntity = serviceBuys.update(dtoBuys);
        return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
    }

    //Obtener datos de la compra a excepcion de el comprobante
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllCompras() {
        List<BeanBuys> compras = repoBuys.findAll();
        List<Map<String, Object>> comprasResponse = compras.stream()
                .map(compra -> {
                    Map<String, Object> compraMap = new HashMap<>();
                    compraMap.put("id", compra.getId());
                    compraMap.put("descripcion", compra.getDescripcion());
                    compraMap.put("fecha", compra.getFecha());
                    compraMap.put("monto", compra.getMonto());
                    compraMap.put("status", compra.getStatus());
                    compraMap.put("idWorker", compra.getBeanWorker().getId());
                    compraMap.put("idDivision", compra.getBeanDivision().getId());
                    return compraMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(comprasResponse);
    }

}