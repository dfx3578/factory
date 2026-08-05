package com.crm.repository;

import com.crm.model.Contact;
import org.springframework.stereotype.Repository;

@Repository
public class ContactRepository extends InMemoryRepository<Contact> {
}
