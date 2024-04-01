package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import mx.edu.utez.sipre.service.ServiceDivision;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/division")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerDivision{
    private final ServiceDivision serviceDivision;
    private final RepoDivision divisionRepository;
    private final RepoWorker workerRepository;
    @CrossOrigin(origins = {"*"})
    @GetMapping("/")

    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(serviceDivision.getAllDivisions());
    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/{id}")

    public ResponseEntity<?> getById(@PathVariable("id") Long id){
        return ResponseEntity.ok(serviceDivision.getDivisionById(id));
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/")

    public ResponseEntity<?> save(@RequestBody BeanDivision division){
        return ResponseEntity.ok(serviceDivision.save(division));
    }

    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}")

    public ResponseEntity<?> update(@RequestBody BeanDivision division){
        return ResponseEntity.ok(serviceDivision.update(division));
    }
    @DeleteMapping("/{id}")

    public ResponseEntity<String> delete(@PathVariable("id")Long id){
        return serviceDivision.deleteDivision(id);
    }



    //ENDPOINT PARA RESTAR SALDO DE LA DIVISIÓN (NOIZEY)
    // Configuración CORS para el endpoint de actualización de saldo
    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}/saldo")
    public ResponseEntity<String> updateDivisionSaldo(@PathVariable Long id, @RequestParam double newSaldo) {
        return serviceDivision.updateSaldo(id, newSaldo);
    }


    //ENDPOINT PARA ACTUALIZAR EL ESTADO DE LA DIVISIÓN GENOCIDIO

    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateDivisionStatus(@PathVariable("id") Long divisionId, @RequestParam("status") boolean newStatus) {
        try {
            // Verificar si el ID de la división es válido
            if (!divisionRepository.existsById(divisionId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ninguna división con ID: " + divisionId);
            }

            // Obtener la división existente de la base de datos
            BeanDivision division = divisionRepository.findById(divisionId).orElse(null);
            if (division == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener la división con ID: " + divisionId);
            }

            if (division.getStatus() == newStatus) {
                return ResponseEntity.badRequest().body("El estado de la división no ha cambiado.");
            }

            // Actualizar el estado de la división
            division.setStatus(newStatus);

            // Si la división se ha cambiado a "Inactivo"
            if (!newStatus) {
                // Eliminar los saldos de los trabajadores que pertenecen a esta división
                List<BeanWorker> workers = workerRepository.findByDivision(division);
                for (BeanWorker worker : workers) {
                    worker.setSaldo(0); // Eliminar el saldo del trabajador
                }

                // Actualizar el saldo de la división (suma de los saldos de los trabajadores)
                double totalSaldo = workers.stream().mapToDouble(BeanWorker::getSaldo).sum();
                division.setSaldo(totalSaldo);
            }

            // Guardar los cambios en la base de datos
            divisionRepository.save(division);

            return ResponseEntity.ok("Estado de la división actualizado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el estado de la división: " + e.getMessage());
        }
    }

}
