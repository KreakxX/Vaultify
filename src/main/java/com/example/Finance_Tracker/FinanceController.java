package com.example.Finance_Tracker;


import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.LifecycleState;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/Finance")
@CrossOrigin(origins = "http://localhost:3000")
public class FinanceController {

    private final FinanceService service;

    @PostMapping("/create/Category/{name}/{color}")
    public Category createCategory(@PathVariable String name, @PathVariable String color){
        return service.createCategory(name,color);
    }

    @DeleteMapping("/delete/Category/{id}")
    public void deleteCategory(@PathVariable Integer id ){
        service.deleteCategory(id);
    }

    @PostMapping("/add/Expense/to/Category/{id}")
    public Category addExpenseToCategory(@PathVariable Integer id, @RequestBody Expense expense){
        return  service.addExpenseToCategory(id,expense);
    }

    @DeleteMapping("/delete/Expense/from/Category/{CategoryId}/{ExpenseId}")
    public Category deleteExpenseFromCategory(@PathVariable Integer CategoryId, @PathVariable Integer ExpenseId){
        return service.deleteExpenseFromCategory(CategoryId,ExpenseId);
    }

    @GetMapping("/get/Categories")
    public List<Category> getAllCategories(){
        return service.getCategories();
    }

    @GetMapping("/get/Expenses/from/Category/{id}")
    public List<Expense> getExpensesFromCategory(@PathVariable Integer id){
        return service.getExpensesFromCategory(id);
    }

    @GetMapping("/get/daily/ausgaben")
    public Map<String,Integer> getDailyAusgaben(){
        return service.getDailyAusgaben();
    }

    @GetMapping("/get/monthly/ausgaben")
    public Map<String,Integer> getMonthlyAusgaben(){
        return service.getMonthlyAusgabe();
    }

    @GetMapping("/find/by/{name}")
    public List<Category> findByExpensesName(@PathVariable String name){
        return service.findByExpensesName(name);
    }

    @GetMapping("/check/if/over/the/Limit")
    public boolean checkIfDailyExpensesAreOverTheLimit(){
        return service.DailyAusgabeÜberLimit();
    }

    @PostMapping("/set/Limit/{amount}")
    public void setLimit(@PathVariable int amount){
        service.setLimit(amount);
    }

    @GetMapping("/get/Limit")
    public int getLimit(){
        return service.getLimit();
    }

    @GetMapping("/ask/ai/how/to/save/more/in/category/{id}")
    public String askAiHowToSaveMoreInCategory(@PathVariable Integer id) throws JsonProcessingException {
        return service.askAiHowToSaveMoreMoneyInCategory(id);
    }

    @GetMapping("/ask/ai/how/to/save/money/in/general")
    public String askAiHowToSaveMoreMoneyInGeneral() throws JsonProcessingException {
        return service.askAiHowToSaveMoreMoneyInGeneral();
    }
}
