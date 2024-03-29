package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.dto.DtoBuys;
import mx.edu.utez.sipre.service.ServiceBuys;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buys")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerBuys {
    private final ServiceBuys serviceBuys;

    @GetMapping("/")
    public ResponseEntity<?> getAllBuys() {
        return ResponseEntity.ok().body(serviceBuys.getAllBuys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBuysById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(serviceBuys.getBuysById(id));
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

}
