package mx.edu.utez.sipre.service;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoWorker;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
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
    private final RepoDivision repoDivision;

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

        // Imprimir los datos del trabajador antes de la inserción
        System.out.println("Datos del trabajador a insertar:");
        System.out.println("Nombre: " + worker.getName());
        System.out.println("Correo electrónico: " + worker.getEmail());
        // Agregar más campos según sea necesario

        // Guardar el trabajador en la base de datos
        try {
            repoWorker.save(worker);

            // Imprimir mensaje de éxito después de la inserción
            System.out.println("Trabajador insertado correctamente");

            // Devolver una respuesta con el estado CREATED y un mensaje indicando que el trabajador se creó exitosamente
            return ResponseEntity.status(HttpStatus.CREATED).body("Trabajador creado exitosamente");
        } catch (Exception e) {
            // Imprimir mensaje de error si la inserción falla
            System.err.println("Error al insertar el trabajador:");
            e.printStackTrace();

            // Devolver una respuesta con el estado INTERNAL_SERVER_ERROR y un mensaje indicando que ocurrió un error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al insertar el trabajador. Por favor, inténtalo de nuevo.");
        }
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

    // METODO PARA CAMBIAR LA DIVISION DEL TRABAJADOR (NOIZEY)
    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> updateDivision(Long idTrabajador, Long idNuevaDivision) {
        // Obtener el trabajador existente de la base de datos
        Optional<BeanWorker> existingWorkerOptional = repoWorker.findById(idTrabajador);
        if (existingWorkerOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ningún trabajador con ID: " + idTrabajador);
        }

        // Obtener la división existente del trabajador
        BeanWorker existingWorker = existingWorkerOptional.get();
        BeanDivision divisionExistente = existingWorker.getDivision();

        // Verificar si la división actual es la misma que la nueva división
        if (divisionExistente.getId().equals(idNuevaDivision)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El trabajador ya pertenece a esta división: " + divisionExistente.getName());
        }

        // Obtener la nueva división
        Optional<BeanDivision> nuevaDivisionOptional = repoDivision.findById(idNuevaDivision);
        if (nuevaDivisionOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ninguna división con ID: " + idNuevaDivision);
        }

        BeanDivision nuevaDivision = nuevaDivisionOptional.get();

        // Actualizar la división del trabajador con la nueva división
        existingWorker.setDivision(nuevaDivision);

        // Restar el saldo de la nueva división
        Double saldoTrabajador = existingWorker.getSaldo();
        Double nuevoSaldoDivision = nuevaDivision.getSaldo() - saldoTrabajador;
        nuevaDivision.setSaldo(nuevoSaldoDivision);
        repoDivision.save(nuevaDivision);

        // Guardar el trabajador actualizado en la base de datos
        repoWorker.save(existingWorker);

        // Devolver una respuesta con el estado OK y un mensaje indicando que la división del trabajador se actualizó exitosamente
        return ResponseEntity.ok().body("División del trabajador actualizada exitosamente a: " + nuevaDivision.getName());
    }



    //METODO PARA ASIGNAR LA NUEVA DIVISION AL TRABAJADOR (NOIZEY)
    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> updateWorkerDivision(Long idTrabajador, Long idNuevaDivision) {
        // Obtener el trabajador existente de la base de datos
        Optional<BeanWorker> existingWorkerOptional = repoWorker.findById(idTrabajador);
        if (existingWorkerOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ningún trabajador con ID: " + idTrabajador);
        }

        // Obtener la nueva división
        Optional<BeanDivision> nuevaDivisionOptional = repoDivision.findById(idNuevaDivision);
        if (nuevaDivisionOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ninguna división con ID: " + idNuevaDivision);
        }

        BeanWorker existingWorker = existingWorkerOptional.get();
        BeanDivision nuevaDivision = nuevaDivisionOptional.get();

        // Actualizar la división del trabajador con la nueva división
        existingWorker.setDivision(nuevaDivision);

        // Guardar el trabajador actualizado en la base de datos
        repoWorker.save(existingWorker);

        // Devolver una respuesta con el estado OK y un mensaje indicando que la división del trabajador se actualizó exitosamente
        return ResponseEntity.ok().body("División del trabajador actualizada exitosamente a: " + nuevaDivision.getName());
    }

    // METODO DE REINTEGRO DE SALDO (BUYS NOIZEY)
    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> reintegroSaldo(Long idTrabajador, Double cantidadReintegro) {
        // Obtener el trabajador existente de la base de datos
        Optional<BeanWorker> existingWorkerOptional = repoWorker.findById(idTrabajador);
        if (existingWorkerOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ningún trabajador con ID: " + idTrabajador);
        }

        BeanWorker existingWorker = existingWorkerOptional.get();
        Double saldoActual = existingWorker.getSaldo();

        // Realizar el reintegro actualizando el saldo del trabajador
        Double nuevoSaldo = saldoActual + cantidadReintegro;
        existingWorker.setSaldo(nuevoSaldo);
        repoWorker.save(existingWorker);

        // Devolver una respuesta con el estado OK y un mensaje indicando que se realizó el reintegro exitosamente
        return ResponseEntity.ok().body("Reintegro de saldo realizado exitosamente. Nuevo saldo: " + nuevoSaldo);
    }





}