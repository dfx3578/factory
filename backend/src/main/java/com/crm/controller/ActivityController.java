package com.crm.controller;

import com.crm.model.Activity;
import com.crm.repository.ActivityRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activities")
public class ActivityController extends CrudController<Activity> {

    public ActivityController(ActivityRepository repository) {
        super(repository);
    }
}
