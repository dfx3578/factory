package com.crm;

import static org.assertj.core.api.Assertions.assertThat;

import com.crm.dto.DashboardResponse;
import com.crm.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Test
    void dashboardMatchesSeededHeadlineNumbers() {
        DashboardResponse dashboard = dashboardService.build();

        assertThat(dashboard.stats()).extracting(DashboardResponse.Stat::value)
                .containsExactly("220", "53", "89", "$2.4M");
        assertThat(dashboard.recentActivity()).extracting(activity -> activity.getType())
                .containsExactly("Call", "Email", "Meeting");
        assertThat(dashboard.performance()).extracting(DashboardResponse.Performer::fullName)
                .containsExactly("Alice Jordan", "Julia Brown", "Jane Smith");
        assertThat(dashboard.recentContacts()).extracting(contact -> contact.getFullName())
                .containsExactly("Jane Smith", "Mike Jordan", "Julia Brown");
        assertThat(dashboard.upcomingTasks()).extracting(task -> task.getStatus())
                .containsExactly("Pending", "In Progress", "Completed");
    }
}
