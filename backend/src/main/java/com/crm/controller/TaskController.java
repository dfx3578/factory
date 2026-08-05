package com.crm.controller;

import com.crm.model.Task;
import com.crm.repository.TaskRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController extends CrudController<Task> {

    public TaskController(TaskRepository repository) {
        super(repository);
    }
}
