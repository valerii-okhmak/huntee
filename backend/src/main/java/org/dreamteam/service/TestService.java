package org.dreamteam.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.dreamteam.Entity.AttemptStatus;
import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.QuestionType;
import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.TestAccessCode;
import org.dreamteam.Entity.TestQuestion;
import org.dreamteam.Entity.TestRegistration;
import org.dreamteam.Entity.User;
import org.dreamteam.Entity.UserAnswer;
import org.dreamteam.Entity.UserTestAttempt;
import org.dreamteam.dto.CandidateDTO;
import org.dreamteam.dto.ExportRequestDTO;
import org.dreamteam.dto.MyTestDTO;
import org.dreamteam.dto.TestAdvancedAnalyticsDTO;
import org.dreamteam.dto.TestAnalyticsDTO;
import org.dreamteam.dto.TestCreateRequest;
import org.dreamteam.dto.TestDetailResponse;
import org.dreamteam.dto.TestSummaryResponse;
import org.dreamteam.dto.TestUpdateRequest;
import org.dreamteam.repository.TestQuestionRepository;
import org.dreamteam.repository.TestRegistrationRepository;
import org.dreamteam.repository.QuestionRepository;
import org.dreamteam.repository.TestAccessCodeRepository;
import org.dreamteam.repository.TestRepository;
import org.dreamteam.repository.UserRepository;
import org.dreamteam.repository.UserTestAttemptRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.stream.Collectors;
import org.dreamteam.dto.QuestionPayloadDTO;

import org.dreamteam.Entity.UserAnswer;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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


    @Transactional
    public void registerForTest(UUID testId, String userEmail) {
        User user = findUserByEmail(userEmail);
        Test test = findTestById(testId);

        if (registrationRepository.existsByUser_IdAndTest_TestId(user.getId(), testId)) {
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

        updateTestQuestions(savedTest, request.getQuestionIds());

        return mapToDetailResponse(savedTest);
    }

    @Cacheable(value = "tests_list")
    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getAllTests() {
        return testRepository.findAll()
                .stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "test_details", key = "#testId")
    @Transactional(readOnly = true)
    public TestDetailResponse getTestById(UUID testId) {
        Test test = findTestById(testId);
        return mapToDetailResponse(test);
    }

    @CacheEvict(value = {"test_details", "tests_list"}, key = "#testId")
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

        test.getTestQuestions().clear();
        testRepository.flush();
        updateTestQuestions(test, request.getQuestionIds());

        Test updatedTest = testRepository.save(test);
        return mapToDetailResponse(updatedTest);
    }

    @CacheEvict(value = {"test_details", "tests_list", "test_analytics"}, allEntries = true)
    @Transactional
    public void deleteTest(UUID testId, String userEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, userEmail);
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

        BigDecimal totalMaxScore = test.getTestQuestions().stream()
                .map(tq -> {
                    Double weight = tq.getQuestion().getWeight();
                    return BigDecimal.valueOf(weight != null ? weight : 1.0);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<UserTestAttempt> attempts = attemptRepository.findByTest_TestId(testId);

        return attempts.stream()
                .filter(a -> a.getCompletedAt() != null)
                .map(attempt -> mapAttemptToCandidate(attempt, totalMaxScore))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "test_analytics", key = "#testId")
    @Transactional(readOnly = true)
    public TestAnalyticsDTO getTestAnalytics(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        double maxPossibleScore = test.getTestQuestions().stream()
                .map(TestQuestion::getQuestion)
                .mapToDouble(Question::getWeight)
                .sum();

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

        if (maxPossibleScore > 0) {
            for (UserTestAttempt attempt : gradedAttempts) {
                double score = attempt.getScore().doubleValue();
                
                double percent = (score / maxPossibleScore) * 100.0;
                if (percent > 100.0) percent = 100.0;

                totalPercentSum += percent;

                if (percent >= PASSING_PERCENT) {
                    passed++;
                } else {
                    failed++;
                }
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
            for (UserAnswer answer : attempt.getUserAnswers()) {
                QuestionType type = answer.getQuestion().getQuestionType();
                double maxPoints = answer.getQuestion().getWeight() != null ? answer.getQuestion().getWeight() : 1.0;
                double earned = answer.getAwardedScore() != null ? answer.getAwardedScore().doubleValue() : 0.0;
                
                double percent = (earned / maxPoints) * 100.0;
                
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

        double totalMaxScore = test.getTestQuestions().stream()
                .mapToDouble(tq -> tq.getQuestion().getWeight() != null ? tq.getQuestion().getWeight() : 1.0)
                .sum();

        for (UserTestAttempt attempt : completedAttempts) {
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
            for (UserAnswer ans : attempt.getUserAnswers()) {
                questionCorrectness.computeIfAbsent(ans.getQuestion().getQuestionId(), k -> new ArrayList<>())
                        .add(Boolean.TRUE.equals(ans.getIsCorrect()));
            }
        }

        List<TestAdvancedAnalyticsDTO.QuestionPerformanceDTO> hardestQuestions = new ArrayList<>();
        
        Map<UUID, Question> questionMap = test.getTestQuestions().stream()
                .map(TestQuestion::getQuestion)
                .collect(Collectors.toMap(Question::getQuestionId, q -> q));

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
                            .weight(q.getWeight() != null ? q.getWeight() : 1.0)
                            .orderIndex(tq.getOrderIndex())
                            .build();
                })
                .collect(Collectors.toList());

        return TestDetailResponse.builder()
                .testId(test.getTestId())
                .testName(test.getTestName())
                .sphere(test.getSphere())
                .level(test.getLevel())
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
        return TestSummaryResponse.builder()
                .testId(test.getTestId())
                .testName(test.getTestName())
                .sphere(test.getSphere())
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

    private CandidateDTO mapAttemptToCandidate(UserTestAttempt attempt, BigDecimal totalMaxScore) {
        User u = attempt.getUser();
        
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
                .totalMaxScore(totalMaxScore)
                .attemptId(attempt.getAttemptId())
                .build();
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

    @Transactional
    public void syncTestQuestionsBulk(UUID testId, List<QuestionPayloadDTO> incomingQuestions) {
        Test test = findTestById(testId);

        List<TestQuestion> existingLinks = testQuestionRepository.findByTest_TestId(testId);
        
        Set<UUID> incomingIds = incomingQuestions.stream()
                .map(QuestionPayloadDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<TestQuestion> linksToDelete = existingLinks.stream()
                .filter(link -> !incomingIds.contains(link.getQuestion().getQuestionId()))
                .collect(Collectors.toList());
        
        testQuestionRepository.deleteAll(linksToDelete);

        List<Question> questionsToSave = new ArrayList<>();
        
        for (int i = 0; i < incomingQuestions.size(); i++) {
            QuestionPayloadDTO dto = incomingQuestions.get(i);
            Question question;

            if (dto.getId() != null) {
                question = questionRepository.findById(dto.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Question not found"));
            } else {
                question = new Question();
                question.setAuthor(test.getUser());
            }

            question.setQuestionText(dto.getQuestionText());
            question.setQuestionType(dto.getQuestionType());
            question.setWeight(dto.getWeight());
            question.setComment(dto.getComment());
            
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
    }
}