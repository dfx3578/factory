package com.crm.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Simple thread-safe in-memory store keyed by a generated Long id.
 */
public abstract class InMemoryRepository<T extends Identifiable> {

    private final ConcurrentHashMap<Long, T> store = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    public List<T> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<T> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public T save(T entity) {
        if (entity.getId() == null) {
            entity.setId(sequence.incrementAndGet());
        } else {
            sequence.updateAndGet(current -> Math.max(current, entity.getId()));
        }
        store.put(entity.getId(), entity);
        return entity;
    }

    public Optional<T> update(Long id, T entity) {
        if (!store.containsKey(id)) {
            return Optional.empty();
        }
        entity.setId(id);
        store.put(id, entity);
        return Optional.of(entity);
    }

    public boolean deleteById(Long id) {
        return store.remove(id) != null;
    }

    public long count() {
        return store.size();
    }
}
