package com.crm.service;

import com.crm.dto.DashboardResponse;
import com.crm.model.Activity;
import com.crm.model.Contact;
import com.crm.model.Deal;
import com.crm.model.Performer;
import com.crm.model.Task;
import com.crm.repository.ActivityRepository;
import com.crm.repository.CompanyRepository;
import com.crm.repository.ContactRepository;
import com.crm.repository.DealRepository;
import com.crm.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private static final String WON_STATUS = "Won";

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;

    public DashboardService(ContactRepository contactRepository,
                            CompanyRepository companyRepository,
                            DealRepository dealRepository,
                            TaskRepository taskRepository,
                            ActivityRepository activityRepository) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.dealRepository = dealRepository;
        this.taskRepository = taskRepository;
        this.activityRepository = activityRepository;
    }

    public DashboardResponse build() {
        List<Deal> deals = dealRepository.findAll();
        long activeDeals = deals.stream()
                .filter(d -> !WON_STATUS.equalsIgnoreCase(d.getStatus())
                        && !"Lost".equalsIgnoreCase(d.getStatus()))
                .count();

        BigDecimal revenue = deals.stream()
                .filter(d -> WON_STATUS.equalsIgnoreCase(d.getStatus()))
                .map(Deal::getValue)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardResponse.Stats stats = new DashboardResponse.Stats(
                contactRepository.count(),
                "+12% from last month",
                companyRepository.count(),
                "+8% from last month",
                activeDeals,
                "-2% from last month",
                formatRevenue(revenue),
                "+25% from last month"
        );

        List<Activity> recentActivity = activityRepository.findAll().stream()
                .sorted(Comparator.comparing(Activity::getId).reversed())
                .limit(3)
                .toList();

        List<Contact> recentContacts = contactRepository.findAll().stream()
                .sorted(Comparator.comparing(Contact::getCreatedAt).reversed()
                        .thenComparing(Comparator.comparing(Contact::getId).reversed()))
                .limit(3)
                .toList();

        List<Task> upcomingTasks = taskRepository.findAll().stream()
                .sorted(Comparator.comparing(Task::getId))
                .limit(3)
                .toList();

        return new DashboardResponse(stats, recentActivity, performance(deals), recentContacts, upcomingTasks);
    }

    private List<Performer> performance(List<Deal> deals) {
        Map<String, Performer> byOwner = new LinkedHashMap<>();
        for (Deal deal : deals) {
            if (!WON_STATUS.equalsIgnoreCase(deal.getStatus()) || deal.getOwner() == null) {
                continue;
            }
            BigDecimal value = deal.getValue() == null ? BigDecimal.ZERO : deal.getValue();
            Performer current = byOwner.get(deal.getOwner());
            if (current == null) {
                byOwner.put(deal.getOwner(), new Performer(deal.getOwner(), 1, value));
            } else {
                current.setClosedDeals(current.getClosedDeals() + 1);
                current.setRevenue(current.getRevenue().add(value));
            }
        }
        return byOwner.values().stream()
                .sorted(Comparator.comparingInt(Performer::getClosedDeals).reversed())
                .limit(3)
                .toList();
    }

    private String formatRevenue(BigDecimal revenue) {
        double value = revenue.doubleValue();
        if (value >= 1_000_000) {
            return String.format("$%.1fM", value / 1_000_000);
        }
        if (value >= 1_000) {
            return String.format("$%.0fK", value / 1_000);
        }
        return String.format("$%.0f", value);
    }
}
