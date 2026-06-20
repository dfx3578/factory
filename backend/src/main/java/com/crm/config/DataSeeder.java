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
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Seeds the in-memory stores on startup. The named records mirror the
 * dashboard mockup; filler records make the headline counts realistic.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] OWNERS = {"Sarah", "Daniel", "Alex", "Emma", "Liam"};
    private static final String[] SOURCES = {"Website", "LinkedIn", "Referral", "Cold call", "Event"};
    private static final String[] STAGES = {"Discovery", "Proposal", "Negotiation", "Qualified"};
    private static final String[] INDUSTRIES = {"Software", "Finance", "Retail", "Healthcare", "Manufacturing"};
    private static final String[] FIRST_NAMES = {"Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
            "Isabella", "Lucas", "Mia", "Logan", "Amelia", "James", "Harper", "Benjamin", "Ella"};
    private static final String[] LAST_NAMES = {"Walker", "Hughes", "Bennett", "Foster", "Reed", "Parker",
            "Bryant", "Coleman", "Hayes", "Russell", "Griffin", "Diaz", "Murphy", "Cole", "Ward"};

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;

    public DataSeeder(ContactRepository contactRepository,
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

    @Override
    public void run(String... args) {
        seedCompanies();
        seedContacts();
        seedDeals();
        seedTasks();
        seedActivities();
    }

    private void seedCompanies() {
        company("Acme Corp", "Software", "201-500", "San Francisco, CA", "acme.com");
        company("Acme Inc.", "Manufacturing", "501-1000", "Austin, TX", "acmeinc.com");
        company("Freelance", "Consulting", "1-10", "Remote", "");
        company("Globex", "Finance", "1001-5000", "New York, NY", "globex.com");
        company("Initech", "Software", "51-200", "Seattle, WA", "initech.com");
        for (int i = (int) companyRepository.count(); i < 53; i++) {
            String name = LAST_NAMES[i % LAST_NAMES.length] + " "
                    + INDUSTRIES[i % INDUSTRIES.length] + " Co.";
            company(name, INDUSTRIES[i % INDUSTRIES.length], "11-50",
                    "City " + i, "company" + i + ".com");
        }
    }

    private void seedContacts() {
        // Filler first so the named records below remain the most recent.
        for (int i = 0; i < 217; i++) {
            Contact c = new Contact(null,
                    FIRST_NAMES[i % FIRST_NAMES.length] + " " + LAST_NAMES[i % LAST_NAMES.length],
                    "contact" + i + "@example.com",
                    "+1 555 01" + String.format("%02d", i % 100),
                    i % 3 == 0 ? "Acme Corp" : "Globex",
                    SOURCES[i % SOURCES.length],
                    OWNERS[i % OWNERS.length],
                    LocalDate.of(2025, 1, 1).plusDays(i % 180));
            contactRepository.save(c);
        }
        contactRepository.save(new Contact(null, "Julia Brown", "julia.brown@freelance.io",
                "+1 555 0102", "Freelance", "LinkedIn", "Alex", LocalDate.of(2025, 7, 7)));
        contactRepository.save(new Contact(null, "Mike Jordan", "mike.jordan@freelance.io",
                "+1 555 0101", "Freelance", "LinkedIn", "Daniel", LocalDate.of(2025, 7, 7)));
        contactRepository.save(new Contact(null, "Jane Smith", "jane.smith@acme.com",
                "+1 555 0100", "Acme Corp", "Website", "Sarah", LocalDate.of(2025, 7, 8)));
    }

    private void seedDeals() {
        // Top performers shown on the dashboard (Won deals grouped by owner).
        wonDeals("Alice Jordan", 6, 75000);
        wonDeals("Julia Brown", 5, 60000);
        wonDeals("Jane Smith", 3, 34000);

        // Additional revenue from large enterprise wins (<=2 per owner so they
        // do not outrank the top performers above).
        String[] enterpriseOwners = {"Daniel", "Sarah", "Alex", "Emma", "Liam",
                "Noah", "Ava", "Ethan", "Mason", "Sophia"};
        for (int i = 0; i < enterpriseOwners.length; i++) {
            for (int j = 0; j < 2; j++) {
                dealRepository.save(new Deal(null,
                        "Enterprise rollout " + i + "-" + j,
                        "Globex",
                        BigDecimal.valueOf(111_550),
                        "Closed",
                        enterpriseOwners[i],
                        "Won",
                        LocalDate.of(2025, 6, 1).plusDays(i)));
            }
        }

        // Active pipeline.
        for (int i = 0; i < 89; i++) {
            dealRepository.save(new Deal(null,
                    "Deal #" + (i + 1),
                    i % 2 == 0 ? "Acme Corp" : "Initech",
                    BigDecimal.valueOf(5_000L + (i * 750L)),
                    STAGES[i % STAGES.length],
                    OWNERS[i % OWNERS.length],
                    "Open",
                    LocalDate.of(2025, 8, 1).plusDays(i)));
        }
    }

    private void seedTasks() {
        taskRepository.save(new Task(null, "Call client", "\"CRM Redesign\"", "Sarah",
                "Pending", LocalDate.of(2025, 7, 10)));
        taskRepository.save(new Task(null, "Prepare quote", "Acme Inc.", "Daniel",
                "In Progress", LocalDate.of(2025, 7, 11)));
        taskRepository.save(new Task(null, "Prepare quote", "Acme Inc.", "Daniel",
                "Completed", LocalDate.of(2025, 7, 9)));
        taskRepository.save(new Task(null, "Send proposal", "Globex", "Alex",
                "Pending", LocalDate.of(2025, 7, 12)));
        taskRepository.save(new Task(null, "Follow up", "Initech", "Emma",
                "In Progress", LocalDate.of(2025, 7, 13)));
    }

    private void seedActivities() {
        // Inserted oldest-first; the dashboard shows the three most recent.
        activityRepository.save(new Activity(null, "Meeting", "Demo scheduled", LocalDate.of(2025, 7, 6)));
        activityRepository.save(new Activity(null, "Email", "Replied to quote request", LocalDate.of(2025, 7, 7)));
        activityRepository.save(new Activity(null, "Call", "Called John Doe", LocalDate.of(2025, 7, 8)));
    }

    private void company(String name, String industry, String size, String location, String website) {
        companyRepository.save(new Company(null, name, industry, size, location, website,
                LocalDate.of(2025, 1, 15)));
    }

    private void wonDeals(String owner, int count, long total) {
        long each = total / count;
        long remainder = total - (each * count);
        for (int i = 0; i < count; i++) {
            long value = each + (i == 0 ? remainder : 0);
            dealRepository.save(new Deal(null,
                    owner + " win #" + (i + 1),
                    "Acme Corp",
                    BigDecimal.valueOf(value),
                    "Closed",
                    owner,
                    "Won",
                    LocalDate.of(2025, 6, 15).plusDays(i)));
        }
    }
}
