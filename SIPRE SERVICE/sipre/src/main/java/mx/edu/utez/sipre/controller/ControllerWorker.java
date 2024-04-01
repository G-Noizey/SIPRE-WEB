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

import java.util.List;

@RestController
@RequestMapping("/worker")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerWorker {
    private final ServiceWorker serviceWorker;
    private final RepoWorker repoWorker;


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





}
