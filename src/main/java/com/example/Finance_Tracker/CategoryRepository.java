package com.example.Finance_Tracker;

import org.apache.catalina.LifecycleState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
