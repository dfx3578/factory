package com.crm.controller;

import com.crm.model.Deal;
import com.crm.repository.DealRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealRepository repository;

    public DealController(DealRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Deal> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(Deal::getId))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deal> findById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Deal create(@RequestBody Deal deal) {
        deal.setId(null);
        return repository.save(deal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deal> update(@PathVariable Long id, @RequestBody Deal deal) {
        return repository.update(id, deal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repository.deleteById(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
