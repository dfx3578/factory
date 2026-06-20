package com.crm.model;

import java.time.LocalDate;

import com.crm.repository.Identifiable;

public class Company implements Identifiable {
    private Long id;
    private String name;
    private String industry;
    private String size;
    private String location;
    private String website;
    private LocalDate createdAt;

    public Company() {
    }

    public Company(Long id, String name, String industry, String size, String location,
                   String website, LocalDate createdAt) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.size = size;
        this.location = location;
        this.website = website;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
