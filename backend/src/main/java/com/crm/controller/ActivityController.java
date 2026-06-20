package com.crm.controller;

import com.crm.model.Activity;
import com.crm.repository.ActivityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityRepository repository;

    public ActivityController(ActivityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Activity> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(Activity::getId).reversed())
                .toList();
    }

    @PostMapping
    public Activity create(@RequestBody Activity activity) {
        activity.setId(null);
        if (activity.getDate() == null) {
            activity.setDate(LocalDate.now());
        }
        return repository.save(activity);
    }
}
