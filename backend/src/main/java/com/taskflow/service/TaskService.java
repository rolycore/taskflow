package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** CRUD de tareas. Cada usuario solo puede ver y modificar las suyas. */
@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll(String email) {
        return taskRepository.findByUsuarioEmailOrderByCreatedAtDesc(email).stream()
                .map(TaskResponse::from)
                .toList();
    }

    public TaskResponse create(String email, TaskRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Task task = new Task();
        task.setUsuario(user);
        apply(task, request);
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse update(String email, Long id, TaskRequest request) {
        Task task = findOwned(email, id);
        apply(task, request);
        return TaskResponse.from(taskRepository.save(task));
    }

    public void delete(String email, Long id) {
        taskRepository.delete(findOwned(email, id));
    }

    private Task findOwned(String email, Long id) {
        return taskRepository.findByIdAndUsuarioEmail(id, email)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));
    }

    private void apply(Task task, TaskRequest request) {
        task.setTitulo(request.titulo().trim());
        task.setDescripcion(request.descripcion());
        task.setEstado(request.estado());
        task.setPrioridad(request.prioridad());
        task.setFechaLimite(request.fechaLimite());
    }
}
