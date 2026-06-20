package com.crm.model;

import java.time.LocalDate;

import com.crm.repository.Identifiable;

public class Task implements Identifiable {
    private Long id;
    private String type;
    private String relatedTo;
    private String assignedTo;
    private String status;
    private LocalDate dueDate;

    public Task() {
    }

    public Task(Long id, String type, String relatedTo, String assignedTo, String status,
                LocalDate dueDate) {
        this.id = id;
        this.type = type;
        this.relatedTo = relatedTo;
        this.assignedTo = assignedTo;
        this.status = status;
        this.dueDate = dueDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRelatedTo() {
        return relatedTo;
    }

    public void setRelatedTo(String relatedTo) {
        this.relatedTo = relatedTo;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
