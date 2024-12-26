package com.example.Finance_Tracker;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Expense {
    @Id
    @GeneratedValue
    private Integer ExpenseId;

    private String name;

    private Integer ausgabe;

    private LocalDateTime ausgabeDatum;

    @ManyToOne
    @JsonIgnore
    private Category category;
}
