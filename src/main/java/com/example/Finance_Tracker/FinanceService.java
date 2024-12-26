package com.example.Finance_Tracker;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class FinanceService {

    private final CategoryRepository categoryRepository;

    private final ExpensesRepository expensesRepository;

    private final LimitRepository limitRepository;

    private final RestTemplate restTemplate;

    public Category createCategory(String name, String Color) {
        Category category = Category.builder()
                .name(name)
                .color(Color)
                .build();
        return categoryRepository.save(category);
    }

    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        List<Expense> expenses = category.getExpenses();
        if (!expenses.isEmpty()) {
            expensesRepository.deleteAll(expenses);
        }
        categoryRepository.deleteById(categoryId);
    }

    public Category addExpenseToCategory(Integer categoryId, Expense expense) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        System.out.println(expense.getAusgabeDatum());
        expense.setCategory(category);
        expensesRepository.save(expense);
        category.getExpenses().add(expense);
        return categoryRepository.save(category);
    }

    public Category deleteExpenseFromCategory(Integer categoryId, Integer ExpenseId) {
        System.out.println(categoryId);
        System.out.println(ExpenseId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category with ID " + categoryId + " not found"));
        for (Expense expense : category.getExpenses()) {
            if (expense.getExpenseId().equals(ExpenseId)) {
                category.getExpenses().remove(expense);
                expensesRepository.delete(expense);
                break;
            }
        }
        return categoryRepository.save(category);
    }

    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    public List<Expense> getExpensesFromCategory(Integer CategoryId) {
        Category category = categoryRepository.findById(CategoryId).orElseThrow();
        return category.getExpenses();
    }

    public boolean DailyAusgabeÜberLimit() {
        List<Limit> limits = limitRepository.findAll();
        for (Limit limit1 : limits) {
            if (limit1.getLimitAmount() == 0) {
                return false;
            } else {
                LocalDateTime start = LocalDate.now().atStartOfDay();
                LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
                List<Expense> dailyExpenses = expensesRepository.findByausgabeDatumBetween(start, end);
                int sum = 0;
                for (Expense expense : dailyExpenses) {
                    sum += expense.getAusgabe();
                }
                return sum > limit1.getLimitAmount();
            }
        }
        return false;
    }

    public Map<String, Integer> getMonthlyAusgabe() {
        List<Category> categories = categoryRepository.findAll();

        categories.sort(Comparator.comparingLong(Category::getCategoryId));

        Map<String, Integer> map = new LinkedHashMap<>();

        for (Category category : categories) {
            LocalDateTime start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            LocalDateTime end = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(LocalTime.MAX);
            List<Expense> categoryExpenses = expensesRepository.findByausgabeDatumBetweenAndCategory(start, end,
                    category);

            int sum = 0;
            for (Expense expense : categoryExpenses) {
                System.out.println(expense.getName());
                sum += expense.getAusgabe();
            }

            map.put(category.getName(), sum);
        }

        map.forEach((key, value) -> System.out.println(key + ": " + value));
        return map;
    }

    public Map<String, Integer> getDailyAusgaben() {
        List<Category> categories = categoryRepository.findAll();

        categories.sort(Comparator.comparingLong(Category::getCategoryId));

        Map<String, Integer> map = new LinkedHashMap<>();

        for (Category category : categories) {
            LocalDateTime start = LocalDate.now().atStartOfDay();
            LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
            List<Expense> categoryExpenses = expensesRepository.findByausgabeDatumBetweenAndCategory(start, end,
                    category);

            int sum = 0;
            for (Expense expense : categoryExpenses) {
                System.out.println(expense.getName());
                sum += expense.getAusgabe();
            }

            // Füge den Eintrag in die Map hinzu
            map.put(category.getName(), sum);
        }

        map.forEach((key, value) -> System.out.println(key + ": " + value));
        return map;
    }

    public List<Category> findByExpensesName(String name) {
        if (name.equals("+")) {
            List<Category> categories = categoryRepository.findAll();
            return categories;
        }
        List<Expense> expenses = expensesRepository.findBynameContaining(name);

        if (expenses == null || expenses.isEmpty()) {
            System.out.println("Keine Ausgaben gefunden");
            return new ArrayList<>();
        }

        List<Category> returnCategories = new ArrayList<>();
        for (Expense expense : expenses) {
            Category category = expense.getCategory();
            if (category != null && !returnCategories.contains(category)) {
                System.out.println("Kategorie hinzugefügt: " + category.getName());
                returnCategories.add(category);
            }
        }

        return returnCategories;
    }

    public void setLimit(int limitAmount) {
        limitRepository.deleteAll();
        Limit limit = Limit.builder()
                .limitAmount(limitAmount).build();
        limitRepository.save(limit);
    }

    public int getLimit() {
        List<Limit> limits = limitRepository.findAll();
        for (Limit limit1 : limits) {
            return limit1.getLimitAmount();
        }
        return 0;
    }

    public String askAiHowToSaveMoreMoneyInCategory(Integer CategoryId) throws JsonProcessingException {
        Category category = categoryRepository.findById(CategoryId).orElseThrow();
        List<Expense> expenses = category.getExpenses();
        StringBuilder prompt = new StringBuilder("Wie kann ich in dieser Kategorie mehr Geld sparen: ")
                .append(category.getName())
                .append("? Die Ausgaben, die ich gemacht habe, sind wie folgt: ");

        for (Expense expense : expenses) {
            prompt.append("Am ")
                    .append(expense.getAusgabeDatum())
                    .append(" habe ich ")
                    .append(expense.getAusgabe())
                    .append(" für ")
                    .append(expense.getName())
                    .append(" ausgegeben; ");
        }
        if (prompt.length() > 0 && prompt.charAt(prompt.length() - 2) == ';') {
            prompt.setLength(prompt.length() - 2);
        }
        String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";
        String geminiKey = "Your API Key";
        String API_URL = String.format(API_URL_TEMPLATE, geminiKey);
        ObjectMapper mapper = new ObjectMapper();
        String promptReal = prompt.toString();
        String requestBody = mapper.writeValueAsString(
                mapper.createObjectNode().set("contents",
                        mapper.createArrayNode().add(mapper.createObjectNode().set("parts",
                                mapper.createArrayNode().add(mapper.createObjectNode().put("text", promptReal))))));
        HttpEntity<String> request = new HttpEntity<>(requestBody);
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);
        JsonNode node = mapper.readTree(response.getBody());
        String answer = node.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        String modifiedAnswer = answer.replaceAll("\\*", "");
        return modifiedAnswer;
    }

    public String askAiHowToSaveMoreMoneyInGeneral() throws JsonProcessingException {
        List<Category> categories = categoryRepository.findAll();
        StringBuilder prompt = new StringBuilder(
                "Wie kann ich allgemein mehr Geld sparen, und wo sollte ich mehr sparen? Die Ausgaben, die ich gemacht habe, sind wie folgt: ");
        for (Category category : categories) {
            prompt.append("Für die Kategorie ").append(category.getName())
                    .append(" sind folgende Ausgaben gemacht worden: ");
            List<Expense> expenses = category.getExpenses();

            for (Expense expense : expenses) {
                prompt.append("Am ")
                        .append(expense.getAusgabeDatum())
                        .append(" habe ich ")
                        .append(expense.getAusgabe())
                        .append(" für ")
                        .append(expense.getName())
                        .append(" ausgegeben; ");
            }
            if (prompt.length() > 0 && prompt.charAt(prompt.length() - 2) == ';') {
                prompt.setLength(prompt.length() - 2);
            }
            prompt.append(". ");
        }

        String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";
        String geminiKey = "Your API Key";
        String API_URL = String.format(API_URL_TEMPLATE, geminiKey);
        ObjectMapper mapper = new ObjectMapper();
        String promptReal = prompt.toString();
        String requestBody = mapper.writeValueAsString(
                mapper.createObjectNode().set("contents",
                        mapper.createArrayNode().add(mapper.createObjectNode().set("parts",
                                mapper.createArrayNode().add(mapper.createObjectNode().put("text", promptReal))))));
        HttpEntity<String> request = new HttpEntity<>(requestBody);
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);
        JsonNode node = mapper.readTree(response.getBody());
        String answer = node.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        String modifiedAnswer = answer.replaceAll("\\*", "");
        return modifiedAnswer;
    }
}
