package com.crm.repository;

import com.crm.model.Task;
import org.springframework.stereotype.Repository;

@Repository
public class TaskRepository extends InMemoryRepository<Task> {
}
