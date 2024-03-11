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

    @GetMapping("/")
    public ResponseEntity<?> getAllWorkers() {
        return ResponseEntity.ok().body(serviceWorker.getAllWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkerById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(serviceWorker.getWorkerById(id));
    }

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody DtoWorker dtoWorker) {
        return ResponseEntity.ok(serviceWorker.save(dtoWorker));
    }


    @PutMapping("/")
    public ResponseEntity<String> update(@RequestBody DtoWorker dtoWorker) {
        ResponseEntity<String> responseEntity = serviceWorker.update(dtoWorker);
        return ResponseEntity.status(responseEntity.getStatusCode()).body(responseEntity.getBody());
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        return serviceWorker.deleteWorker(id);
    }
}
