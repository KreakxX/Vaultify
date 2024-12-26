package com.example.Finance_Tracker;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ExpensesRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByausgabeDatumBetweenAndCategory(LocalDateTime start, LocalDateTime end, Category category);
    List<Expense>findByausgabeDatumBetween(LocalDateTime start, LocalDateTime end);

    List<Expense> findBynameContaining(String name);

}
