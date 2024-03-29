package mx.edu.utez.sipre.controller;


import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.dto.DtoTransfer;
import mx.edu.utez.sipre.service.ServiceTransfer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transfer")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ControllerTransfer {
    private final ServiceTransfer serviceTransfer;

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





}
