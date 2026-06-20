package com.crm.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.crm.repository.Identifiable;

public class Deal implements Identifiable {
    private Long id;
    private String name;
    private String company;
    private BigDecimal value;
    private String stage;
    private String owner;
    private String status;
    private LocalDate closeDate;

    public Deal() {
    }

    public Deal(Long id, String name, String company, BigDecimal value, String stage,
                String owner, String status, LocalDate closeDate) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.value = value;
        this.stage = stage;
        this.owner = owner;
        this.status = status;
        this.closeDate = closeDate;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(LocalDate closeDate) {
        this.closeDate = closeDate;
    }
}
