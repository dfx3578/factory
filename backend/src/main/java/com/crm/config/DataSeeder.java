package com.crm.config;

import com.crm.model.Activity;
import com.crm.model.Company;
import com.crm.model.Contact;
import com.crm.model.Deal;
import com.crm.model.Task;
import com.crm.repository.ActivityRepository;
import com.crm.repository.CompanyRepository;
import com.crm.repository.ContactRepository;
import com.crm.repository.DealRepository;
import com.crm.repository.TaskRepository;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the in-memory stores so the dashboard reflects the reference design:
 * 220 contacts, 53 companies, 89 active deals and $2.4M of won revenue.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final int TOTAL_CONTACTS = 220;
    private static final int TOTAL_COMPANIES = 53;
    private static final int ACTIVE_DEALS = 89;
    private static final double TARGET_REVENUE = 2_400_000;

    private final ContactRepository contacts;
    private final CompanyRepository companies;
    private final DealRepository deals;
    private final TaskRepository tasks;
    private final ActivityRepository activities;

    public DataSeeder(ContactRepository contacts, CompanyRepository companies, DealRepository deals,
            TaskRepository tasks, ActivityRepository activities) {
        this.contacts = contacts;
        this.companies = companies;
        this.deals = deals;
        this.tasks = tasks;
        this.activities = activities;
    }

    @Override
    public void run(String... args) {
        seedCompanies();
        seedContacts();
        seedDeals();
        seedTasks();
        seedActivities();
    }

    private void seedCompanies() {
        String[] names = {"Acme Corp", "Freelance", "Globex", "Initech", "Umbrella", "Soylent", "Stark Industries"};
        String[] industries = {"Software", "Consulting", "Manufacturing", "Retail", "Healthcare"};
        for (int i = 0; i < TOTAL_COMPANIES; i++) {
            Company company = new Company();
            company.setName(i < names.length ? names[i] : "Company " + (i + 1));
            company.setIndustry(industries[i % industries.length]);
            company.setWebsite("https://example.com/" + (i + 1));
            company.setSize(i % 3 == 0 ? "1-50" : i % 3 == 1 ? "51-250" : "250+");
            company.setOwner(owner(i));
            companies.save(company);
        }
    }

    private void seedContacts() {
        for (int i = 0; i < TOTAL_CONTACTS - 3; i++) {
            Contact contact = new Contact();
            contact.setFullName("Contact " + (i + 1));
            contact.setEmail("contact" + (i + 1) + "@example.com");
            contact.setPhone("+1 555 01" + String.format("%02d", i % 100));
            contact.setCompany(i % 4 == 0 ? "Freelance" : "Acme Corp");
            contact.setSource(i % 2 == 0 ? "Website" : "LinkedIn");
            contact.setOwner(owner(i));
            contact.setCreatedAt(LocalDate.of(2025, 6, 1).plusDays(i % 28));
            contacts.save(contact);
        }
        contacts.save(contact("Mike Jordan", "mike.jordan@example.com", "Freelance", "LinkedIn", "Daniel",
                LocalDate.of(2025, 7, 7)));
        contacts.save(contact("Julia Brown", "julia.brown@example.com", "Freelance", "LinkedIn", "Alex",
                LocalDate.of(2025, 7, 7)));
        contacts.save(contact("Jane Smith", "jane.smith@example.com", "Acme Corp", "Website", "Sarah",
                LocalDate.of(2025, 7, 8)));
    }

    private void seedDeals() {
        String[] stages = {"Qualification", "Proposal", "Negotiation"};
        for (int i = 0; i < ACTIVE_DEALS; i++) {
            deals.save(deal("Deal " + (i + 1), "Acme Corp", 12_000 + (i * 250), stages[i % stages.length], owner(i),
                    LocalDate.of(2025, 8, 1).plusDays(i % 30)));
        }

        seedWonDeals("Alice Jordan", 6, 75_000);
        seedWonDeals("Julia Brown", 5, 60_000);
        seedWonDeals("Jane Smith", 3, 34_000);

        // Filler won deals bring total revenue to the headline figure without
        // displacing the leaderboard (no filler owner closes more than 2 deals).
        double remaining = TARGET_REVENUE - 169_000;
        int fillerDeals = 22;
        double perDeal = remaining / fillerDeals;
        for (int i = 0; i < fillerDeals; i++) {
            deals.save(deal("Renewal " + (i + 1), "Company " + (i + 8), perDeal, "Won", "Partner " + (i / 2 + 1),
                    LocalDate.of(2025, 5, 1).plusDays(i)));
        }
    }

    private void seedWonDeals(String owner, int count, double total) {
        double perDeal = total / count;
        for (int i = 0; i < count; i++) {
            deals.save(deal(owner.split(" ")[0] + " win " + (i + 1), "Acme Corp", perDeal, "Won", owner,
                    LocalDate.of(2025, 6, 1).plusDays(i)));
        }
    }

    private void seedTasks() {
        tasks.save(task("Prepare quote", "Acme Inc.", "Daniel", "Completed", LocalDate.of(2025, 7, 4)));
        tasks.save(task("Prepare quote", "Acme Inc.", "Daniel", "In Progress", LocalDate.of(2025, 7, 9)));
        tasks.save(task("Call client", "\"CRM Redesign\"", "Sarah", "Pending", LocalDate.of(2025, 7, 10)));
    }

    private void seedActivities() {
        activities.save(activity("Meeting", "Demo scheduled", LocalDate.of(2025, 7, 6)));
        activities.save(activity("Email", "Replied to quote request", LocalDate.of(2025, 7, 7)));
        activities.save(activity("Call", "Called John Doe", LocalDate.of(2025, 7, 8)));
    }

    private String owner(int index) {
        String[] owners = {"Sarah", "Daniel", "Alex"};
        return owners[index % owners.length];
    }

    private Contact contact(String fullName, String email, String company, String source, String owner,
            LocalDate createdAt) {
        Contact contact = new Contact();
        contact.setFullName(fullName);
        contact.setEmail(email);
        contact.setPhone("+1 555 0100");
        contact.setCompany(company);
        contact.setSource(source);
        contact.setOwner(owner);
        contact.setCreatedAt(createdAt);
        return contact;
    }

    private Deal deal(String name, String company, double amount, String stage, String owner, LocalDate closeDate) {
        Deal deal = new Deal();
        deal.setName(name);
        deal.setCompany(company);
        deal.setAmount(amount);
        deal.setStage(stage);
        deal.setOwner(owner);
        deal.setCloseDate(closeDate);
        return deal;
    }

    private Task task(String title, String relatedTo, String assignedTo, String status, LocalDate dueDate) {
        Task task = new Task();
        task.setTitle(title);
        task.setRelatedTo(relatedTo);
        task.setAssignedTo(assignedTo);
        task.setStatus(status);
        task.setDueDate(dueDate);
        return task;
    }

    private Activity activity(String type, String description, LocalDate occurredAt) {
        Activity activity = new Activity();
        activity.setType(type);
        activity.setDescription(description);
        activity.setOccurredAt(occurredAt);
        return activity;
    }
}
