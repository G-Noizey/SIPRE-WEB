    package mx.edu.utez.sipre.service;

    import lombok.RequiredArgsConstructor;
    import mx.edu.utez.sipre.model.bean.BeanAdmin;
    import mx.edu.utez.sipre.model.repositories.RepoAdmin;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.sql.SQLException;
    import java.util.*;

    @Service
    @Transactional
    @RequiredArgsConstructor
    public class ServiceAdmin {
        private final RepoAdmin repoAdmin;

        @Transactional(readOnly = true)
        public ResponseEntity<List<BeanAdmin>> getAllAdmins() {
            List<BeanAdmin> admins = repoAdmin.findAll();
            return ResponseEntity.ok().body(admins);
        }

        @Transactional(readOnly = true)
        public ResponseEntity<BeanAdmin> getAdminById(Long id) {
            Optional<BeanAdmin> adminOptional = repoAdmin.findById(id);
            if (adminOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(adminOptional.get());
        }

        @Transactional(rollbackFor = {SQLException.class})
        public ResponseEntity<String> save(BeanAdmin admin) {
            if (repoAdmin.findByUserAdmin(admin.getUserAdmin()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El administrador ya existe con el nombre de usuario: " + admin.getUserAdmin());
            }
            if (repoAdmin.findByEmail(admin.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Hay un administrador que ya existe con el correo: " + admin.getEmail());
            }
            repoAdmin.save(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body("Administrador creado exitosamente");
        }

        @Transactional(rollbackFor = {SQLException.class})
        public ResponseEntity<BeanAdmin> update(BeanAdmin admin) {
            Optional<BeanAdmin> existingAdminOptional = repoAdmin.findById(admin.getId());

            if (existingAdminOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            BeanAdmin updatedAdmin = repoAdmin.save(admin);
            return ResponseEntity.ok().body(updatedAdmin);
        }

        @Transactional(rollbackFor = {SQLException.class})
        public ResponseEntity<String> deleteAdmin(Long id) {
            if (!repoAdmin.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el administrador con ID " + id);
            }
            try {
                repoAdmin.deleteById(id);
                return ResponseEntity.ok().body("Administrador con ID " + id + " eliminado correctamente");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el administrador con ID " + id);
            }
        }


        //REEMPLAZAR ESTE METODO

        //FUNCIONES IMPLEMENTADAS PARA LA AUTENTICACIÓN LOGIN (NOIZEY)
        //MÉTODOS DE CUENTA DESACTIVADA Y AGREGACIÓN DE DATOS PARA EL LOCAL STORAGE
        @Transactional(readOnly = true)
        public ResponseEntity<Map<String, String>> authenticate(BeanAdmin admin) {
            Optional<BeanAdmin> adminOptional = repoAdmin.findByUserAdmin(admin.getUserAdmin());
            if (adminOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("status", "error"));
            }

            BeanAdmin storedAdmin = adminOptional.get();
            if (!storedAdmin.getPassword().equals(admin.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("status", "error"));
            }

            if (storedAdmin.getStatus() != null && !storedAdmin.getStatus()) {
                // Cuenta desactivada
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("status", "inactive"));
            }

            Map<String, String> responseData = new HashMap<>();

            responseData.put("id", storedAdmin.getId().toString());
            responseData.put("token", generateToken());
            responseData.put("name", storedAdmin.getName());
            responseData.put("role", String.valueOf(storedAdmin.getRole()));
            responseData.put("email", storedAdmin.getEmail());
            responseData.put("apellido", storedAdmin.getApellido());
            responseData.put("userAdmin", storedAdmin.getUserAdmin());

            return ResponseEntity.ok(responseData);
        }



        //FUNCIÓN PARA GENERAR EL TOKEN (NOIZEY)

        private String generateToken() {
            int length = 64; // Longitud del token
            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Caracteres permitidos en el token
            StringBuilder token = new StringBuilder();

            for (int i = 0; i < length; i++) {
                int index = (int) (Math.random() * characters.length());
                token.append(characters.charAt(index));
            }

            return token.toString();
        }

    //cambios adan
        @Transactional(rollbackFor = {SQLException.class})
        public ResponseEntity<BeanAdmin> updateUsername(Long id, String newUsername) {
            Optional<BeanAdmin> existingAdminOptional = repoAdmin.findById(id);

            if (existingAdminOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            BeanAdmin existingAdmin = existingAdminOptional.get();
            existingAdmin.setUserAdmin(newUsername); // Actualiza el nombre de usuario

            BeanAdmin updatedAdmin = repoAdmin.save(existingAdmin);
            return ResponseEntity.ok().body(updatedAdmin);
        }

        @Transactional(rollbackFor = {SQLException.class})
        public ResponseEntity<BeanAdmin> updatePassword(Long id, String newPassword) {
            Optional<BeanAdmin> existingAdminOptional = repoAdmin.findById(id);

            if (existingAdminOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            BeanAdmin existingAdmin = existingAdminOptional.get();
            existingAdmin.setPassword(newPassword); // Actualiza la contraseña

            BeanAdmin updatedAdmin = repoAdmin.save(existingAdmin);
            return ResponseEntity.ok().body(updatedAdmin);
        }

        @Transactional(rollbackFor = {SQLException.class})
        public ResponseEntity<BeanAdmin> updateByEmail(String email, String newPassword) {
            Optional<BeanAdmin> existingAdminOptional = repoAdmin.findByEmail(email);

            if (existingAdminOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            BeanAdmin existingAdmin = existingAdminOptional.get();
            existingAdmin.setPassword(newPassword);
            BeanAdmin updatedAdmin = repoAdmin.save(existingAdmin);
            return ResponseEntity.ok().body(updatedAdmin);
        }

    }



//Métodos extra que no son parte del CRUD principal
    /*
    @Transactional(readOnly = true)
    public ResponseEntity<String> getByUserAdmin(String userAdmin) {
        Optional<Object> adminOptional = repoAdmin.findByUserAdmin(userAdmin);
        if (adminOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador con nombre de usuario " + userAdmin + " no encontrado.");
        }
        return ResponseEntity.ok(adminOptional.get().toString());
    }



    @Transactional(readOnly = true)
    public ResponseEntity<String> getByName(String name) {
        Optional<Object> adminOptional = repoAdmin.findByName(name);
        if (adminOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador con nombre " + name + " no encontrado.");
        }
        return ResponseEntity.ok(adminOptional.get().toString());
    }

    @Transactional(readOnly = true)
    public ResponseEntity<String> getByStatus(boolean status) {
        List<BeanAdmin> adminList = repoAdmin.findAll();
        if (adminList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay administradores registrados.");
        }
        StringBuilder response = new StringBuilder();
        for (BeanAdmin admin : adminList) {
            if (admin.isStatus() == status) {
                response.append(admin.toString()).append("\n");
            }
        }
        return ResponseEntity.ok(response.toString());
    }
    */

