package com.example.Finance_Tracker;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LimitRepository  extends JpaRepository<Limit,Integer> {
}
