package com.crm.controller;

import com.crm.model.Contact;
import com.crm.repository.ContactRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacts")
public class ContactController extends CrudController<Contact> {

    public ContactController(ContactRepository repository) {
        super(repository);
    }
}
