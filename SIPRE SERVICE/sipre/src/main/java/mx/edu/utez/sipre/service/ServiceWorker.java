package mx.edu.utez.sipre.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoWorker;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceWorker {
    private final RepoWorker repoWorker;

    @Transactional(readOnly = true)
    public ResponseEntity<List<BeanWorker>> getAllWorkers() {
        List<BeanWorker> workers = repoWorker.findAll();
        return ResponseEntity.ok().body(workers);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<BeanWorker> getWorkerById(Long id) {
        Optional<BeanWorker> workerOptional = repoWorker.findById(id);
        return workerOptional.map(worker -> ResponseEntity.ok().body(worker)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> save(DtoWorker dtoWorker) {
        // Verificar si ya existe un trabajador con el mismo correo electrónico
        if(repoWorker.findByEmail(dtoWorker.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un trabajador con el mismo correo electrónico: " + dtoWorker.getEmail());
        }

        // Verificar si ya existe un trabajador con el mismo nombre de usuario
        if(repoWorker.findByUserWorker(dtoWorker.getUserWorker()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un trabajador con el mismo nombre de usuario: " + dtoWorker.getUserWorker());
        }

        // Crear la división basada en el ID proporcionado en el DTO
        BeanDivision division = BeanDivision.builder().id((long) dtoWorker.getIdDivision()).build();

        // Crear el trabajador
        BeanWorker worker = BeanWorker.builder()
                .name(dtoWorker.getName())
                .lastname(dtoWorker.getLastname())
                .email(dtoWorker.getEmail())
                .password(dtoWorker.getPassword())
                .status(dtoWorker.getStatus())
                .userWorker(dtoWorker.getUserWorker())
                .saldo(dtoWorker.getSaldo())
                .telefono(dtoWorker.getTelefono())
                .direccion(dtoWorker.getDireccion())
                .division(division)
                .build();

        // Guardar el trabajador en la base de datos
        repoWorker.save(worker);

        // Devolver una respuesta con el estado CREATED y un mensaje indicando que el trabajador se creó exitosamente
        return ResponseEntity.status(HttpStatus.CREATED).body("Trabajador creado exitosamente");
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> update(DtoWorker dtoWorker) {
        // Obtener el trabajador existente de la base de datos
        Optional<BeanWorker> existingWorkerOptional = repoWorker.findById(dtoWorker.getId());
        if (existingWorkerOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ningún trabajador con ID: " + dtoWorker.getId());
        }

        // Obtener la división basada en el ID proporcionado en el DTO
        BeanDivision division = BeanDivision.builder().id((long) dtoWorker.getIdDivision()).build();

        // Actualizar los campos del trabajador existente con los valores del DTO
        BeanWorker existingWorker = existingWorkerOptional.get();
        existingWorker.setName(dtoWorker.getName());
        existingWorker.setLastname(dtoWorker.getLastname());
        existingWorker.setEmail(dtoWorker.getEmail());
        existingWorker.setPassword(dtoWorker.getPassword());
        existingWorker.setStatus(dtoWorker.getStatus());
        existingWorker.setUserWorker(dtoWorker.getUserWorker());
        existingWorker.setSaldo(dtoWorker.getSaldo());
        existingWorker.setTelefono(dtoWorker.getTelefono());
        existingWorker.setDireccion(dtoWorker.getDireccion());
        existingWorker.setDivision(division);

        // Guardar el trabajador actualizado en la base de datos
        repoWorker.save(existingWorker);

        // Devolver una respuesta con el estado OK y un mensaje indicando que el trabajador se actualizó exitosamente
        return ResponseEntity.ok().body("Trabajador actualizado exitosamente");
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> deleteWorker(Long id) {
        if (!repoWorker.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trabajador con id " + id + " no encontrado");
        }
        repoWorker.deleteById(id);
        return ResponseEntity.ok().body("Trabajador eliminado exitosamente");
    }
}