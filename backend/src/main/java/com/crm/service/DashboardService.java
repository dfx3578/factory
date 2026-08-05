package com.crm.service;

import com.crm.dto.DashboardResponse;
import com.crm.model.Contact;
import com.crm.model.Deal;
import com.crm.model.Task;
import com.crm.repository.ActivityRepository;
import com.crm.repository.CompanyRepository;
import com.crm.repository.ContactRepository;
import com.crm.repository.DealRepository;
import com.crm.repository.TaskRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private static final String WON = "Won";

    private final ContactRepository contacts;
    private final CompanyRepository companies;
    private final DealRepository deals;
    private final TaskRepository tasks;
    private final ActivityRepository activities;

    public DashboardService(ContactRepository contacts, CompanyRepository companies, DealRepository deals,
            TaskRepository tasks, ActivityRepository activities) {
        this.contacts = contacts;
        this.companies = companies;
        this.deals = deals;
        this.tasks = tasks;
        this.activities = activities;
    }

    public DashboardResponse build() {
        List<Deal> allDeals = deals.findAll();
        long activeDeals = allDeals.stream().filter(deal -> !WON.equals(deal.getStage()) && !"Lost".equals(deal.getStage())).count();
        double revenue = allDeals.stream().filter(deal -> WON.equals(deal.getStage())).mapToDouble(Deal::getAmount).sum();

        List<DashboardResponse.Stat> stats = List.of(
                new DashboardResponse.Stat("Total contacts", String.valueOf(contacts.count()), "+12% from last month", "up", "users"),
                new DashboardResponse.Stat("Companies", String.valueOf(companies.count()), "+8% from last month", "up", "building"),
                new DashboardResponse.Stat("Active deals", String.valueOf(activeDeals), "-2% from last month", "down", "chart"),
                new DashboardResponse.Stat("Revenue", formatRevenue(revenue), "+25% from last month", "up", "dollar"));

        return new DashboardResponse(stats, latest(activities.findAll(), 3), topPerformers(allDeals),
                recentContacts(), latest(tasks.findAll(), 3));
    }

    private List<DashboardResponse.Performer> topPerformers(List<Deal> allDeals) {
        Map<String, List<Deal>> byOwner = allDeals.stream()
                .filter(deal -> WON.equals(deal.getStage()) && deal.getOwner() != null)
                .collect(Collectors.groupingBy(Deal::getOwner));

        return byOwner.entrySet().stream()
                .map(entry -> new DashboardResponse.Performer(entry.getKey(), entry.getValue().size(),
                        entry.getValue().stream().mapToDouble(Deal::getAmount).sum()))
                .sorted(Comparator.comparingLong(DashboardResponse.Performer::closedDeals).reversed())
                .limit(3)
                .toList();
    }

    private List<Contact> recentContacts() {
        return contacts.findAll().stream()
                .filter(contact -> contact.getCreatedAt() != null)
                .sorted(Comparator.comparing(Contact::getCreatedAt).reversed().thenComparing(Contact::getId))
                .limit(3)
                .toList();
    }

    private <T extends com.crm.model.Identifiable> List<T> latest(List<T> items, int limit) {
        return items.stream().sorted(Comparator.comparingLong(T::getId).reversed()).limit(limit).toList();
    }

    private String formatRevenue(double revenue) {
        if (revenue >= 1_000_000) {
            return String.format("$%.1fM", revenue / 1_000_000);
        }
        if (revenue >= 1_000) {
            return String.format("$%.0fK", revenue / 1_000);
        }
        return String.format("$%.0f", revenue);
    }

    public List<Task> upcomingTasks() {
        return tasks.findAll();
    }
}
