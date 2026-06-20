package com.crm.dto;

import com.crm.model.Activity;
import com.crm.model.Contact;
import com.crm.model.Performer;
import com.crm.model.Task;

import java.util.List;

public record DashboardResponse(
        Stats stats,
        List<Activity> recentActivity,
        List<Performer> performance,
        List<Contact> recentContacts,
        List<Task> upcomingTasks
) {
    public record Stats(
            long totalContacts,
            String contactsChange,
            long companies,
            String companiesChange,
            long activeDeals,
            String dealsChange,
            String revenue,
            String revenueChange
    ) {
    }
}
