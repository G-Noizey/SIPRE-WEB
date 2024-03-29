package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.service.ServiceDivision;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/division")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerDivision{
    private final ServiceDivision serviceDivision;

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

}
