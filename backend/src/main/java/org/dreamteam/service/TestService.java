package org.dreamteam.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.TestQuestion;
import org.dreamteam.Entity.TestRegistration;
import org.dreamteam.Entity.User;
import org.dreamteam.Entity.UserTestAttempt;
import org.dreamteam.dto.CandidateDTO;
import org.dreamteam.dto.MyTestDTO;
import org.dreamteam.dto.TestAnalyticsDTO;
import org.dreamteam.dto.TestCreateRequest;
import org.dreamteam.dto.TestDetailResponse;
import org.dreamteam.dto.TestSummaryResponse;
import org.dreamteam.dto.TestUpdateRequest;
import org.dreamteam.repository.TestQuestionRepository;
import org.dreamteam.repository.TestRegistrationRepository;
import org.dreamteam.repository.QuestionRepository;
import org.dreamteam.repository.TestRepository;
import org.dreamteam.repository.UserRepository;
import org.dreamteam.repository.UserTestAttemptRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashSet;

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

    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getAllTests() {
        return testRepository.findAll()
                .stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestDetailResponse getTestById(UUID testId) {
        Test test = findTestById(testId);
        return mapToDetailResponse(test);
    }

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

    @Transactional(readOnly = true)
    public TestAnalyticsDTO getTestAnalytics(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        double maxPossibleScore = test.getTestQuestions().stream()
                .map(TestQuestion::getQuestion) 
                .mapToDouble(Question::getWeight)
                .sum();

        if (maxPossibleScore == 0) {
             return TestAnalyticsDTO.builder()
                    .totalAttempts(0)
                    .passedCount(0)
                    .failedCount(0)
                    .averageScore(0.0)
                    .build();
        }

        List<UserTestAttempt> attempts = attemptRepository.findByTest_TestId(testId);

        List<UserTestAttempt> completedAttempts = attempts.stream()
                .filter(a -> a.getCompletedAt() != null && a.getScore() != null)
                .toList();

        int total = completedAttempts.size();
        int passed = 0;
        int failed = 0;
        double totalPercentSum = 0; 

        final double PASSING_PERCENT = 60.0;

        for (UserTestAttempt attempt : completedAttempts) {
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

        double avgPercent = total > 0 ? totalPercentSum / total : 0;

        return TestAnalyticsDTO.builder()
                .totalAttempts(total)
                .passedCount(passed)
                .failedCount(failed)
                .averageScore(Math.round(avgPercent * 100.0) / 100.0) 
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
        return CandidateDTO.builder()
                .userId(u.getId())
                .fullName(getFullName(u))
                .email(u.getEmail())
                .profileImageUrl(getAvatarUrl(u))
                .status("REGISTERED")
                .date(reg.getRegisteredAt())
                .score(null)
                .build();
    }

    private CandidateDTO mapAttemptToCandidate(UserTestAttempt attempt, BigDecimal totalMaxScore) {
        User u = attempt.getUser();
        return CandidateDTO.builder()
                .userId(u.getId())
                .fullName(getFullName(u))
                .email(u.getEmail())
                .profileImageUrl(getAvatarUrl(u))
                .status("COMPLETED")
                .date(attempt.getCompletedAt())
                .score(attempt.getScore())
                .totalMaxScore(totalMaxScore)
                .attemptId(attempt.getAttemptId())
                .build();
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
}