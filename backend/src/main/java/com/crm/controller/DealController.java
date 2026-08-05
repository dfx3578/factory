package com.crm.controller;

import com.crm.model.Deal;
import com.crm.repository.DealRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deals")
public class DealController extends CrudController<Deal> {

    public DealController(DealRepository repository) {
        super(repository);
    }
}
