package org.dreamteam.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.*;
import org.dreamteam.dto.*;
import org.dreamteam.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;

import java.time.OffsetDateTime;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.stream.Collectors;
import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final UserRepository userRepository;
    private final TestRegistrationRepository registrationRepository;
    private final UserTestAttemptRepository attemptRepository;
    private final NotificationService notificationService;
    private final QuestionRepository questionRepository;
    private final ExportService exportService;
    private final TestAccessCodeRepository testAccessCodeRepository;
    private final TestLevelRepository testLevelRepository;
    private final UserAnswerRepository userAnswerRepository; 

    private static final int MAX_TESTS_PER_USER = 5;
    private static final int MAX_QUESTIONS_PER_TEST = 500;

    @Transactional
    public void registerForTest(UUID testId, String userEmail) {
        Test test = findTestById(testId);

        if (Boolean.TRUE.equals(test.getIsPrivate())) {
            throw new AccessDeniedException("Цей тест є приватним. Реєстрація можлива лише за спеціальним посиланням або кодом.");
        }

        executeRegistration(test, userEmail);
    }

    @Transactional
    public void registerByInviteOrCode(UUID testId, String userEmail) {
        Test test = findTestById(testId);
        executeRegistration(test, userEmail); 
    }

    private void executeRegistration(Test test, String userEmail) {
        User user = findUserByEmail(userEmail);

        if (registrationRepository.existsByUser_IdAndTest_TestId(user.getId(), test.getTestId())) {
            throw new IllegalStateException("User is already registered for this test."); 
        }

        TestRegistration registration = new TestRegistration(user, test);
        registrationRepository.save(registration);

        String title = "Реєстрація успішна!";
        String message = "Ви успішно зареєструвалися на тест: " + test.getTestName();
        notificationService.sendSystemNotification(user.getId(), title, message);
    }

    @CacheEvict(value = "tests_list", allEntries = true)
    @Transactional
    public TestDetailResponse createTest(TestCreateRequest request, String authorEmail) {
        User author = findUserByEmail(authorEmail);

        int currentTestCount = testRepository.findByUser_Id(author.getId()).size();
        if (currentTestCount >= MAX_TESTS_PER_USER) {
            throw new IllegalStateException("Перевищено ліміт! Ви можете створити максимум " + MAX_TESTS_PER_USER + " тестів.");
        }

        Test test = new Test(request.getTestName(), author);
        test.setSphere(request.getSphere());
        test.setLevel(request.getLevel());
        test.setCity(request.getCity());
        test.setVacancyDescription(request.getVacancyDescription());
        test.setResponsibilities(request.getResponsibilities());
        test.setIsFixedTime(request.getIsFixedTime());
        test.setStartTime(request.getStartTime());
        test.setEndTime(request.getEndTime());
        test.setDurationMinutes(request.getDurationMinutes());
        test.setIsPrivate(request.getIsPrivate());
        test.setIsFixedQuestionOrder(request.getIsFixedQuestionOrder());
        test.setIsFixedAnswerOrder(request.getIsFixedAnswerOrder());
        test.setIsShowResult(request.getIsShowResult());
        
        Test savedTest = testRepository.save(test);

        Set<TestLevel> levels = processTestLevels(request.getLevels(), savedTest);
        
        testLevelRepository.saveAll(levels);
        
        if (savedTest.getTestLevels() == null) {
            savedTest.setTestLevels(new HashSet<>());
        }
        savedTest.getTestLevels().clear();
        savedTest.getTestLevels().addAll(levels);

        updateTestQuestions(savedTest, request.getQuestionIds());

        return mapToDetailResponse(savedTest);
    }

    @Cacheable(value = "tests_list")
    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getAllTests() {
        return testRepository.findAll()
                .stream()
                .filter(test -> !Boolean.TRUE.equals(test.getIsPrivate()))
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestDetailResponse getTestById(UUID testId, String userEmail) {
        Test test = findTestById(testId);
        
        if (Boolean.TRUE.equals(test.getIsPrivate())) {
            User user = findUserByEmail(userEmail);
            boolean isAuthor = test.getUser().getId().equals(user.getId());
            boolean isRegistered = registrationRepository.existsByUser_IdAndTest_TestId(user.getId(), testId);
            
            if (!isAuthor && !isRegistered) {
                throw new AccessDeniedException("Цей тест є приватним. У вас немає доступу.");
            }
        }

        return mapToDetailResponse(test);
    }

    @Caching(evict = {
        @CacheEvict(value = "tests_list", allEntries = true)
    })
    @Transactional
    public TestDetailResponse updateTest(UUID testId, TestUpdateRequest request, String userEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, userEmail);

        test.setTestName(request.getTestName());
        test.setSphere(request.getSphere());
        test.setLevel(request.getLevel());
        test.setCity(request.getCity());
        test.setVacancyDescription(request.getVacancyDescription());
        test.setResponsibilities(request.getResponsibilities());
        test.setIsFixedTime(request.getIsFixedTime());
        test.setStartTime(request.getStartTime());
        test.setEndTime(request.getEndTime());
        test.setDurationMinutes(request.getDurationMinutes());
        test.setIsPrivate(request.getIsPrivate());
        test.setIsFixedQuestionOrder(request.getIsFixedQuestionOrder());
        test.setIsFixedAnswerOrder(request.getIsFixedAnswerOrder());
        test.setIsShowResult(request.getIsShowResult());
        
        Set<TestLevel> updatedLevels = processTestLevels(request.getLevels(), test);
        test.getTestLevels().clear();
        test.getTestLevels().addAll(updatedLevels);

        testLevelRepository.saveAll(test.getTestLevels());

        test.getTestQuestions().clear();
        testRepository.flush();
        updateTestQuestions(test, request.getQuestionIds());

        Test updatedTest = testRepository.save(test);
        return mapToDetailResponse(updatedTest);
    }


    @Caching(evict = {
        @CacheEvict(value = "test_analytics", key = "#testId"),
        @CacheEvict(value = "tests_list", allEntries = true)
    })
    @Transactional
    public void deleteTest(UUID testId, String userEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, userEmail);

        if (test.getTestQuestions() != null) {
            for (TestQuestion tq : test.getTestQuestions()) {
                Question q = tq.getQuestion();
                if (q != null && q.getTestLevel() != null) {
                    if (q.getTestLevel().getTest().getTestId().equals(testId)) {
                        q.setTestLevel(null);
                        questionRepository.save(q);
                    }
                }
            }
        }
        test.getTestQuestions().clear();
        testRepository.flush(); 

        testAccessCodeRepository.deleteByTest_TestId(testId);

        testRepository.delete(test);
    }

    public List<MyTestDTO> getCreatedTests(String userEmail) {
        User user = findUserByEmail(userEmail);
        List<Test> tests = testRepository.findByUser_Id(user.getId());

        return tests.stream().map(test -> {
            int candidates = registrationRepository.findByTest_TestId(test.getTestId()).size();
            String dynamicStatus = calculateTestStatus(test);

            return MyTestDTO.builder()
                    .id(test.getTestId())
                    .title(test.getTestName())
                    .sphere(test.getSphere())
                    .level(test.getLevel())
                    .city(test.getCity())
                    .startTime(test.getStartTime())
                    .status(dynamicStatus)
                    .candidatesCount(candidates)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<MyTestDTO> getMyCandidateTests(String userEmail) {
        User user = findUserByEmail(userEmail);
        List<TestRegistration> registrations = registrationRepository.findByUser_Id(user.getId());
        
        return registrations.stream().map(reg -> {
            Test test = reg.getTest();
            String timeStatus = calculateTestStatus(test);
            return MyTestDTO.builder()
                    .id(test.getTestId())
                    .title(test.getTestName())
                    .sphere(test.getSphere())
                    .level(test.getLevel())
                    .city(test.getCity())
                    .startTime(test.getStartTime())
                    .status("Registered")
                    .statusTest(timeStatus) 
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidateDTO> getRegisteredCandidates(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        List<TestRegistration> registrations = registrationRepository.findByTest_TestId(testId);

        return registrations.stream()
                .map(this::mapRegistrationToCandidate)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidateDTO> getTestResults(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        List<UserTestAttempt> attempts = attemptRepository.findByTest_TestId(testId);

        return attempts.stream()
                .filter(a -> a.getCompletedAt() != null)
                .map(this::mapAttemptToCandidate)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "test_analytics", key = "#testId")
    @Transactional(readOnly = true)
    public TestAnalyticsDTO getTestAnalytics(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        List<UserTestAttempt> allAttempts = attemptRepository.findByTest_TestId(testId);

        long inReviewCount = allAttempts.stream()
                .filter(a -> a.getStatus() == AttemptStatus.PENDING_REVIEW)
                .count();

        List<UserTestAttempt> gradedAttempts = allAttempts.stream()
                .filter(a -> a.getStatus() == AttemptStatus.COMPLETED && a.getScore() != null)
                .toList();

        int passed = 0;
        int failed = 0;
        double totalPercentSum = 0;
        final double PASSING_PERCENT = 60.0;

        for (UserTestAttempt attempt : gradedAttempts) {
            List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());
            double maxPossibleScore = answers.stream()
                .mapToDouble(a -> a.getQuestion().getEffectiveWeight() != null ? a.getQuestion().getEffectiveWeight() : 1.0)
                .sum();

            if (maxPossibleScore > 0) {
                double score = attempt.getScore().doubleValue();
                double percent = (score / maxPossibleScore) * 100.0;
                if (percent > 100.0) percent = 100.0;

                totalPercentSum += percent;

                if (percent >= PASSING_PERCENT) {
                    passed++;
                } else {
                    failed++;
                }
            } else {
                failed++; 
            }
        }

        int gradedTotal = gradedAttempts.size();
        double avgPercent = gradedTotal > 0 ? totalPercentSum / gradedTotal : 0;
        int totalSubmitted = gradedTotal + (int) inReviewCount;

        return TestAnalyticsDTO.builder()
                .totalAttempts(totalSubmitted)
                .passedCount(passed)
                .failedCount(failed)
                .inReviewCount((int) inReviewCount) 
                .averageScore(Math.round(avgPercent * 100.0) / 100.0)
                .build();
    }

    @Transactional(readOnly = true)
    public TestAdvancedAnalyticsDTO getAdvancedAnalytics(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        List<UserTestAttempt> attempts = attemptRepository.findByTest_TestId(testId);
        
        List<UserTestAttempt> completedAttempts = attempts.stream()
                .filter(a -> a.getCompletedAt() != null && a.getScore() != null)
                .collect(Collectors.toList());

        Map<QuestionType, List<Double>> typeScores = new HashMap<>();
        
        for (UserTestAttempt attempt : completedAttempts) {
            List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());
            
            for (UserAnswer answer : answers) {
                QuestionType type = answer.getQuestion().getQuestionType();
                double maxPoints = answer.getQuestion().getEffectiveWeight() != null ? answer.getQuestion().getEffectiveWeight() : 1.0;
                double earned = answer.getAwardedScore() != null ? answer.getAwardedScore().doubleValue() : 0.0;
                
                double percent = (maxPoints > 0) ? (earned / maxPoints) * 100.0 : 0.0;
                typeScores.computeIfAbsent(type, k -> new ArrayList<>()).add(percent);
            }
        }

        Map<String, Double> skillsProfile = new HashMap<>();
        for (Map.Entry<QuestionType, List<Double>> entry : typeScores.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            skillsProfile.put(entry.getKey().name(), Math.round(avg * 100.0) / 100.0);
        }

        Map<String, Integer> distribution = new LinkedHashMap<>(); 
        distribution.put("0-20%", 0);
        distribution.put("21-40%", 0);
        distribution.put("41-60%", 0);
        distribution.put("61-80%", 0);
        distribution.put("81-100%", 0);

        for (UserTestAttempt attempt : completedAttempts) {
            List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());
            double totalMaxScore = answers.stream()
                .mapToDouble(a -> a.getQuestion().getEffectiveWeight() != null ? a.getQuestion().getEffectiveWeight() : 1.0)
                .sum();
            
            double score = attempt.getScore().doubleValue();
            double percent = (totalMaxScore > 0) ? (score / totalMaxScore) * 100.0 : 0;

            if (percent <= 20) distribution.merge("0-20%", 1, Integer::sum);
            else if (percent <= 40) distribution.merge("21-40%", 1, Integer::sum);
            else if (percent <= 60) distribution.merge("41-60%", 1, Integer::sum);
            else if (percent <= 80) distribution.merge("61-80%", 1, Integer::sum);
            else distribution.merge("81-100%", 1, Integer::sum);
        }

        Map<UUID, List<Boolean>> questionCorrectness = new HashMap<>();
        
        for (UserTestAttempt attempt : completedAttempts) {
            List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());
            for (UserAnswer ans : answers) {
                questionCorrectness.computeIfAbsent(ans.getQuestion().getQuestionId(), k -> new ArrayList<>())
                        .add(Boolean.TRUE.equals(ans.getIsCorrect()));
            }
        }

        List<TestAdvancedAnalyticsDTO.QuestionPerformanceDTO> hardestQuestions = new ArrayList<>();
        
        Map<UUID, Question> questionMap = test.getTestQuestions().stream()
                .map(TestQuestion::getQuestion)
                .collect(Collectors.toMap(Question::getQuestionId, q -> q, (existing, replacement) -> existing));

        for (Map.Entry<UUID, List<Boolean>> entry : questionCorrectness.entrySet()) {
            long total = entry.getValue().size();
            long correct = entry.getValue().stream().filter(b -> b).count();
            double percent = (double) correct / total * 100.0;

            Question q = questionMap.get(entry.getKey());
            if (q != null) {
                hardestQuestions.add(TestAdvancedAnalyticsDTO.QuestionPerformanceDTO.builder()
                        .questionText(q.getQuestionText())
                        .type(q.getQuestionType())
                        .correctPercentage(Math.round(percent * 100.0) / 100.0)
                        .build());
            }
        }
        
        hardestQuestions.sort(Comparator.comparingDouble(TestAdvancedAnalyticsDTO.QuestionPerformanceDTO::getCorrectPercentage));
        if (hardestQuestions.size() > 5) {
            hardestQuestions = hardestQuestions.subList(0, 5);
        }

        List<TestAdvancedAnalyticsDTO.TimeScorePoint> scatterData = completedAttempts.stream()
                .map(a -> {
                    long seconds = Duration.between(a.getStartedAt(), a.getCompletedAt()).getSeconds();

                    return TestAdvancedAnalyticsDTO.TimeScorePoint.builder()
                            .durationSeconds(seconds)
                            .score(a.getScore().doubleValue())
                            .candidateName(getFullName(a.getUser()))
                            .build();
                })
                .collect(Collectors.toList());

        return TestAdvancedAnalyticsDTO.builder()
                .skillsProfile(skillsProfile)
                .scoreDistribution(distribution)
                .hardestQuestions(hardestQuestions)
                .timeVsScore(scatterData)
                .build();
    }

    private String calculateTestStatus(Test test) {
        OffsetDateTime now = OffsetDateTime.now();

        if (test.getStartTime() != null && now.isBefore(test.getStartTime())) {
            return "Scheduled";
        }

        if (test.getEndTime() != null && now.isAfter(test.getEndTime())) {
            return "Closed"; 
        }

        return "Active"; 
    }

    private void updateTestQuestions(Test test, List<UUID> questionIds) {
        if (questionIds == null || questionIds.isEmpty()) return;

        if (questionIds.size() > MAX_QUESTIONS_PER_TEST) {
            throw new IllegalArgumentException("Перевищено ліміт! Тест не може містити більше " + MAX_QUESTIONS_PER_TEST + " питань.");
        }

        List<TestQuestion> newLinks = new ArrayList<>();

        for (int i = 0; i < questionIds.size(); i++) {
            UUID qId = questionIds.get(i);
            Question question = questionRepository.findById(qId)
                    .orElseThrow(() -> new EntityNotFoundException("Question not found: " + qId));

            newLinks.add(new TestQuestion(test, question, i + 1));
        }

        testQuestionRepository.saveAll(newLinks);
        if (test.getTestQuestions() == null) {
            test.setTestQuestions(new HashSet<>());
        }
        test.getTestQuestions().addAll(newLinks);
    }

    public byte[] exportTestResults(UUID testId, ExportRequestDTO request, String email) throws IOException {
        List<CandidateDTO> results = getTestResults(testId, email);
        
        if (request.getGroupTag() != null && !request.getGroupTag().trim().isEmpty()) {
            results = results.stream()
                    .filter(c -> request.getGroupTag().equals(c.getGroupTag()))
                    .collect(Collectors.toList());
        }

        Test test = findTestById(testId);

        if ("PDF".equalsIgnoreCase(request.getFormat())) {
            return exportService.exportToPdf(test.getTestName(), request.getColumns(), results);
        } else {
            return exportService.exportToExcel(test.getTestName(), request.getColumns(), results);
        }
    }
    
    private TestDetailResponse mapToDetailResponse(Test test) {
        List<TestQuestion> testQuestions = testQuestionRepository.findByTest_TestId(test.getTestId());

        testQuestions.sort(Comparator.comparingInt(tq -> 
            tq.getOrderIndex() != null ? tq.getOrderIndex() : Integer.MAX_VALUE));

        List<TestDetailResponse.QuestionSummary> questionSummaries = testQuestions.stream()
                .map(tq -> {
                    Question q = tq.getQuestion();
                    return TestDetailResponse.QuestionSummary.builder()
                            .questionId(q.getQuestionId())
                            .questionText(q.getQuestionText())
                            .questionType(q.getQuestionType())
                            .weight(q.getEffectiveWeight())
                            .orderIndex(tq.getOrderIndex())
                            .build();
                })
                .collect(Collectors.toList());

        List<TestLevelDTO> levelDtos = test.getTestLevels() != null 
                ? test.getTestLevels().stream()
                    .map(l -> new TestLevelDTO(l.getId(), l.getName(), l.getWeight(), l.getOrderIndex(), l.getQuestionsLimit()))
                    .collect(Collectors.toList())
                : new ArrayList<>();

        return TestDetailResponse.builder()
                .testId(test.getTestId())
                .testName(test.getTestName())
                .sphere(test.getSphere())
                .level(test.getLevel())
                .levels(levelDtos)
                .city(test.getCity())
                .vacancyDescription(test.getVacancyDescription())
                .responsibilities(test.getResponsibilities())
                .isFixedTime(test.getIsFixedTime())
                .startTime(test.getStartTime())
                .endTime(test.getEndTime())
                .durationMinutes(test.getDurationMinutes())
                .authorUsername(test.getUser().getUsername())
                .isPrivate(test.getIsPrivate())
                .questions(questionSummaries)
                .isFixedQuestionOrder(test.getIsFixedQuestionOrder())
                .isFixedAnswerOrder(test.getIsFixedAnswerOrder())
                .isShowResult(test.getIsShowResult())
                .build();
    }

    private TestSummaryResponse mapToSummaryResponse(Test test) {
        List<TestLevelDTO> levelDtos = test.getTestLevels() != null 
                ? test.getTestLevels().stream()
                    .map(l -> new TestLevelDTO(l.getId(), l.getName(), l.getWeight(), l.getOrderIndex(), l.getQuestionsLimit()))
                    .collect(Collectors.toList())
                : new ArrayList<>();

        return TestSummaryResponse.builder()
                .testId(test.getTestId())
                .testName(test.getTestName())
                .sphere(test.getSphere())
                .levels(levelDtos)
                .level(test.getLevel())
                .city(test.getCity())
                .startTime(test.getStartTime())
                .endTime(test.getEndTime())
                .isFixedTime(test.getIsFixedTime())
                .authorUsername(test.getUser().getUsername())
                .isPrivate(test.getIsPrivate())
                .isShowResult(test.getIsShowResult())
                .build();
    }

    private CandidateDTO mapRegistrationToCandidate(TestRegistration reg) {
        User u = reg.getUser();
        
        String tag = testAccessCodeRepository.findByTest_TestIdAndUsedByUser_Id(reg.getTest().getTestId(), u.getId())
                .map(code -> code.getTag())
                .orElse("-");

        return CandidateDTO.builder()
                .userId(u.getId())
                .fullName(getFullName(u))
                .email(u.getEmail())
                .profileImageUrl(getAvatarUrl(u))
                .groupTag(tag) 
                .status("REGISTERED")
                .date(reg.getRegisteredAt())
                .score(null)
                .build();
    }

    private CandidateDTO mapAttemptToCandidate(UserTestAttempt attempt) {
        User u = attempt.getUser();
        
        List<UserAnswer> answers = userAnswerRepository.findByAttempt_AttemptId(attempt.getAttemptId());
        double attemptMaxScore = answers.stream()
            .mapToDouble(a -> a.getQuestion().getEffectiveWeight() != null ? a.getQuestion().getEffectiveWeight() : 1.0)
            .sum();

        String tag = testAccessCodeRepository.findByTest_TestIdAndUsedByUser_Id(attempt.getTest().getTestId(), u.getId())
                .map(code -> code.getTag()) 
                .orElse("-");

        return CandidateDTO.builder()
                .userId(u.getId())
                .fullName(getFullName(u))
                .email(u.getEmail())
                .groupTag(tag) 
                .status("COMPLETED")
                .date(attempt.getCompletedAt())
                .score(attempt.getScore())
                .totalMaxScore(BigDecimal.valueOf(attemptMaxScore).setScale(2, RoundingMode.HALF_UP))
                .attemptId(attempt.getAttemptId())
                .build();
    }

    private Set<TestLevel> processTestLevels(List<TestLevelDTO> levelDtos, Test test) {
        Set<TestLevel> testLevels = new HashSet<>();
        
        if (levelDtos != null && !levelDtos.isEmpty()) {
            for (TestLevelDTO dto : levelDtos) {
                if (dto == null) {
                    continue; 
                }

                TestLevel testLevel = null;

                if (dto.getId() != null) {
                    testLevel = testLevelRepository.findById(dto.getId()).orElse(null);
                } 
                
                if (testLevel == null && dto.getName() != null && !dto.getName().trim().isEmpty()) {
                    String trimmedName = dto.getName().trim();
                    
                    if (test.getTestId() != null) {
                        testLevel = testLevelRepository.findByTest_TestIdAndNameIgnoreCase(test.getTestId(), trimmedName).orElse(null);
                    }
                    
                    if (testLevel == null) {
                        testLevel = new TestLevel();
                        testLevel.setName(trimmedName);
                        testLevel.setTest(test); 
                    }
                }

                if (testLevel != null) {
                    testLevel.setWeight(dto.getWeight());
                    testLevel.setOrderIndex(dto.getOrderIndex());
                    testLevel.setQuestionsLimit(dto.getQuestionsLimit()); 
                    testLevels.add(testLevel);
                }
            }
        }
        return testLevels;
    }

    @Transactional(readOnly = true)
    public List<String> getTestGroups(UUID testId) {
        return testAccessCodeRepository.findUniqueTagsByTestId(testId);
    }

    private Test findTestById(UUID testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));
    }

    private void checkTestOwnership(Test test, String email) {
        if (!test.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to modify or delete this test.");
        }
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private String getFullName(User user) {
        if (user.getProfile() != null) {
            String first = user.getProfile().getFirstName();
            String last = user.getProfile().getLastName();
            return (first != null ? first : "") + " " + (last != null ? last : "");
        }
        return "User " + user.getId();
    }

    private String getAvatarUrl(User user) {
        if (user.getProfile() != null) {
            return user.getProfile().getProfileImageUrl();
        }
        return null;
    }

    @Caching(evict = {
        @CacheEvict(value = "test_details", key = "#testId"),
        @CacheEvict(value = "test_analytics", key = "#testId")
    })
    @Transactional
    public void syncTestQuestionsBulk(UUID testId, List<QuestionPayloadDTO> incomingQuestions) {
        // 🛡️ ЗАХИСТ: Ліміт на питання при масовому додаванні/редагуванні
        if (incomingQuestions != null && incomingQuestions.size() > MAX_QUESTIONS_PER_TEST) {
            throw new IllegalArgumentException("Перевищено ліміт! Тест не може містити більше " + MAX_QUESTIONS_PER_TEST + " питань.");
        }

        Test test = findTestById(testId);

        List<TestQuestion> existingLinks = testQuestionRepository.findByTest_TestId(testId);
        
        Set<UUID> incomingIds = incomingQuestions.stream()
                .map(QuestionPayloadDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<TestQuestion> linksToDelete = existingLinks.stream()
                .filter(link -> !incomingIds.contains(link.getQuestion().getQuestionId()))
                .collect(Collectors.toList());
        
        if (test.getTestQuestions() != null) {
            test.getTestQuestions().removeAll(linksToDelete);
        }
        testQuestionRepository.deleteAll(linksToDelete);
        testRepository.flush();

        List<Question> questionsToSave = new ArrayList<>();
        
        for (int i = 0; i < incomingQuestions.size(); i++) {
            QuestionPayloadDTO dto = incomingQuestions.get(i);
            Question question;

            if (dto.getId() != null) {
                question = questionRepository.findById(dto.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Question not found: " + dto.getId()));
            } else {
                question = new Question();
                question.setAuthor(test.getUser());
            }

            question.setQuestionText(dto.getQuestionText());
            question.setQuestionType(dto.getQuestionType());
            
            Double incomingWeight = dto.getCustomWeight() != null ? dto.getCustomWeight() : (dto.getCustomWeight() != null ? dto.getCustomWeight() : null);
            question.setCustomWeight(incomingWeight);
            
            question.setComment(dto.getComment());
            
            if (dto.getLevelId() != null) {
                TestLevel level = testLevelRepository.findById(dto.getLevelId())
                        .orElseThrow(() -> new EntityNotFoundException("Рівень не знайдено: " + dto.getLevelId()));
                question.setTestLevel(level);
            } else {
                question.setTestLevel(null);
            }
            
            if (question.getChoiceOptions() != null) {
                question.getChoiceOptions().clear();
            } else {
                question.setChoiceOptions(new HashSet<>());
            }
            
            if (question.getTextAnswer() != null) {
                question.setTextAnswer(null);
            }
            if (question.getCodeAnswer() != null) {
                question.setCodeAnswer(null);
            }
            
            if (dto.getChoiceOptions() != null && !dto.getChoiceOptions().isEmpty()) {
                for (var optDto : dto.getChoiceOptions()) {
                    ChoiceOption option = new ChoiceOption(question, optDto.getOptionText(), optDto.getIsCorrect());
                    question.getChoiceOptions().add(option);
                }
            }

            if (dto.getTextAnswer() != null) {
                TextAnswer textAnswer = new TextAnswer(question, dto.getTextAnswer().getCorrectText(), dto.getTextAnswer().getIsCaseSensitive());
                question.setTextAnswer(textAnswer);
            }

            if (dto.getCodeAnswer() != null) {
                CodeAnswer codeAnswer = new CodeAnswer(
                    question, 
                    dto.getCodeAnswer().getTemplateCode(), 
                    dto.getCodeAnswer().getTestCases(),
                    dto.getCodeAnswer().getLanguage(),
                    dto.getCodeAnswer().getMethodName()
                );
                question.setCodeAnswer(codeAnswer);
            }

            questionsToSave.add(question);
        }

        List<Question> savedQuestions = questionRepository.saveAll(questionsToSave);

        List<TestQuestion> newLinks = new ArrayList<>();
        for (int i = 0; i < savedQuestions.size(); i++) {
            Question savedQ = savedQuestions.get(i);
            
            TestQuestion link = testQuestionRepository.findByTestAndQuestion(test, savedQ)
                    .orElse(new TestQuestion(test, savedQ, i));
            
            link.setOrderIndex(i); 
            newLinks.add(link);
        }

        testQuestionRepository.saveAll(newLinks);
        
        if (test.getTestQuestions() == null) {
            test.setTestQuestions(new HashSet<>());
        }
        test.getTestQuestions().addAll(newLinks);
    }
}