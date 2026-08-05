package com.crm.controller;

import com.crm.model.Company;
import com.crm.repository.CompanyRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
public class CompanyController extends CrudController<Company> {

    public CompanyController(CompanyRepository repository) {
        super(repository);
    }
}
