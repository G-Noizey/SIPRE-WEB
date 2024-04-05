package mx.edu.utez.sipre.model.dto;

public class LoginRequest {
    private String userWorker;
    private String password;

    // Constructores, getters y setters

    public LoginRequest() {
    }

    public LoginRequest(String userWorker, String password) {
        this.userWorker = userWorker;
        this.password = password;
    }

    public String getUserWorker() {
        return userWorker;
    }

    public void setUserWorker(String userWorker) {
        this.userWorker = userWorker;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
