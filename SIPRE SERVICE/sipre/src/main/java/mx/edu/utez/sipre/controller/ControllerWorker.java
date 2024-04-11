package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoWorker;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import mx.edu.utez.sipre.service.ServiceWorker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/worker")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerWorker {
    private final ServiceWorker serviceWorker;
    private final RepoWorker repoWorker;


    @CrossOrigin(origins = {"*"})
    @GetMapping("/saldosPorDivision/{idDivision}")
    public ResponseEntity<?> getSaldosTrabajadoresPorDivision(@PathVariable("idDivision") Long idDivision) {
        return serviceWorker.getSaldosTrabajadoresPorDivision(idDivision);
    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/")
    public ResponseEntity<?> getAllWorkers() {
        return ResponseEntity.ok().body(serviceWorker.getAllWorkers());
    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkerById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(serviceWorker.getWorkerById(id));
    }

    @CrossOrigin(origins = {"*"})
    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody DtoWorker dtoWorker) {
        return ResponseEntity.ok(serviceWorker.save(dtoWorker));
    }

    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}")
    public ResponseEntity<String> update(@RequestBody DtoWorker dtoWorker) {
        ResponseEntity<String> responseEntity = serviceWorker.update(dtoWorker);
        return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
    }

    @CrossOrigin(origins = {"*"})
    @PutMapping("/{idTrabajador}/division/{idNuevaDivision}")
    public ResponseEntity<String> updateDivision(@PathVariable Long idTrabajador, @PathVariable Long idNuevaDivision) {
        return serviceWorker.updateDivision(idTrabajador, idNuevaDivision);
    }

    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}/division")
    public ResponseEntity<String> updateWorkerDivision(@PathVariable("id") Long idTrabajador, @RequestParam("idNuevaDivision") Long idNuevaDivision) {
        ResponseEntity<String> responseEntity = serviceWorker.updateWorkerDivision(idTrabajador, idNuevaDivision);
        return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
    }

    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}/infoPersonal")
    public ResponseEntity<String> updateInfoPersonal(@RequestBody DtoWorker dtoWorker) {
        ResponseEntity<String> responseEntity = serviceWorker.updateInfoPersonal(dtoWorker);
        return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
    }


    //METODO PARA VALIDAR CORREOS SIMILARES (NOIZEY)
    @GetMapping("/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = repoWorker.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }


    //METODO PARA VALIDAR USERNAMES SIMILARES (NOIZEY)
    @GetMapping("/userWorker/{userWorker}")
    public ResponseEntity<Boolean> checkUserWorkerExists(@PathVariable String userWorker) {
        boolean exists = repoWorker.existsByUserWorker(userWorker);
        return ResponseEntity.ok(exists);
    }


    @CrossOrigin(origins = {"*"})
    @PutMapping("/{id}/reintegro")
    public ResponseEntity<String> reintegroSaldo(@PathVariable("id") Long idTrabajador, @RequestParam Double cantidadReintegro) {
        return serviceWorker.reintegroSaldo(idTrabajador, cantidadReintegro);
    }

    @CrossOrigin(origins = {"*"})
    @PutMapping("/update-password")
    public ResponseEntity<?> updateByEmail(@RequestParam String email, @RequestParam String newPassword) {
        return serviceWorker.updateByEmail(email, newPassword);
    }

    @PutMapping("/{id}/username")
    public ResponseEntity<String> updateUsernameMob(@PathVariable("id") Long id, @RequestBody DtoWorker dtoWorker) {
        try {
            return serviceWorker.updateUsername(id, dtoWorker.getUserWorker());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el nombre de usuario: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable("id") Long id, @RequestBody DtoWorker dtoWorker) {
        try {
            return serviceWorker.updatePassword(id, dtoWorker.getPassword());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la contraseña: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/updateSaldo")
    public ResponseEntity<?> updateSaldo(@PathVariable Long id, @RequestParam double nuevoSaldo) {
        try {
            BeanWorker worker = repoWorker.findById(id)
                    .orElseThrow(() -> new RuntimeException("Worker not found with id: " + id));
            worker.setSaldo(nuevoSaldo);
            repoWorker.save(worker);
            return ResponseEntity.ok().body("Saldo actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el saldo: " + e.getMessage());
        }
    }

    @GetMapping("/exists/{nuCuenta}")
    public ResponseEntity<Boolean> existsByNuCuenta(@PathVariable String nuCuenta) {
        boolean exists = serviceWorker.existsByNuCuenta(nuCuenta);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        return serviceWorker.deleteWorker(id);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody DtoWorker workerRequest) {
        return serviceWorker.authenticate(workerRequest);
    }


    ////Cambios Jair

    @GetMapping("/{id}/details")
    public ResponseEntity<Map<String, Object>> getWorkerDetails(@PathVariable Long id) {
        // Buscar el trabajador por su ID
        Optional<BeanWorker> workerOptional = repoWorker.findById(id);

        // Verificar si el trabajador existe
        if (workerOptional.isPresent()) {
            BeanWorker worker = workerOptional.get();

            // Crear un mapa para almacenar los detalles del trabajador
            Map<String, Object> workerDetails = new HashMap<>();
            workerDetails.put("saldo", worker.getSaldo());
            workerDetails.put("nuCuenta", worker.getNuCuenta());
            workerDetails.put("divisionStatus", worker.getDivision().getStatus());

            return ResponseEntity.ok(workerDetails);
        } else {
            // Devolver un error si el trabajador no se encuentra
            return ResponseEntity.notFound().build();
        }
    }


  /*
    @PutMapping("/{id}/saldo")
    public ResponseEntity<?> updateWorkerSaldo(@PathVariable Long id, @RequestBody Map<String, Double> saldoData) {
        try {
            // Obtener el trabajador por su ID
            BeanWorker worker = serviceWorker.findById(id);

            // Establecer el nuevo saldo
            worker.setSaldo(saldoData.get("saldo"));

            // Guardar el trabajador actualizado
            serviceWorker.save(worker);

            return ResponseEntity.ok().body("Saldo del trabajador actualizado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el saldo del trabajador: " + e.getMessage());
        }
    } */

}
