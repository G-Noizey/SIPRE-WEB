package mx.edu.utez.sipre.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceDivision {
    private final RepoDivision repoDivision;

    @Transactional(readOnly = true)
    public ResponseEntity<List<BeanDivision>> getAllDivisions() {
        List<BeanDivision> divisions = repoDivision.findAll();
        return ResponseEntity.ok().body(divisions);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<BeanDivision> getDivisionById(Long id) {
        Optional<BeanDivision> divisionOptional = repoDivision.findById(id);
        if (divisionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(divisionOptional.get());
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> save(BeanDivision division) {
        if (repoDivision.findByName(division.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe una división con este nombre");
        }

        if (repoDivision.findBySiglas(division.getSiglas()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe una división con estas siglas");
        }

        repoDivision.save(division);
        return ResponseEntity.status(HttpStatus.CREATED).body("División creada exitosamente");
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<BeanDivision> update(BeanDivision division) {
        Optional<BeanDivision> existingDivisionOptional = repoDivision.findById(division.getId());
        if (existingDivisionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        BeanDivision updatedDivision = repoDivision.save(division);
        return ResponseEntity.ok().body(updatedDivision);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> deleteDivision(Long id) {
        if (!repoDivision.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("División con id " + id + " no encontrado");
        }
        repoDivision.deleteById(id);
        return ResponseEntity.ok().body("División eliminada exitosamente");
    }


    // METODO PARA RESTAR SALDO A LA DIVISIÓN (NOIZEY)
    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> updateSaldo(Long id, double newSaldo) {
        Optional<BeanDivision> divisionOptional = repoDivision.findById(id);
        if (divisionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BeanDivision division = divisionOptional.get();
        division.setSaldo(newSaldo);
        repoDivision.save(division);

        return ResponseEntity.ok("Saldo de la división actualizado exitosamente");
    }





}

