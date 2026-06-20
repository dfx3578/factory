package com.crm.model;

import java.math.BigDecimal;

public class Performer {
    private String fullName;
    private int closedDeals;
    private BigDecimal revenue;

    public Performer() {
    }

    public Performer(String fullName, int closedDeals, BigDecimal revenue) {
        this.fullName = fullName;
        this.closedDeals = closedDeals;
        this.revenue = revenue;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public int getClosedDeals() {
        return closedDeals;
    }

    public void setClosedDeals(int closedDeals) {
        this.closedDeals = closedDeals;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
