package com.crm.model;

import java.time.LocalDate;

import com.crm.repository.Identifiable;

public class Activity implements Identifiable {
    private Long id;
    private String type;
    private String description;
    private LocalDate date;

    public Activity() {
    }

    public Activity(Long id, String type, String description, LocalDate date) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.date = date;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
