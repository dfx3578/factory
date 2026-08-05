package com.crm.dto;

import com.crm.model.Activity;
import com.crm.model.Contact;
import com.crm.model.Task;
import java.util.List;

public record DashboardResponse(
        List<Stat> stats,
        List<Activity> recentActivity,
        List<Performer> performance,
        List<Contact> recentContacts,
        List<Task> upcomingTasks) {

    public record Stat(String label, String value, String change, String tone, String icon) {
    }

    public record Performer(String fullName, long closedDeals, double revenue) {
    }
}
