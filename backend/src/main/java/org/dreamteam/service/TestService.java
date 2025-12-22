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
import org.dreamteam.repository.TestRepository;
import org.dreamteam.repository.UserRepository;
import org.dreamteam.repository.UserTestAttemptRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final UserRepository userRepository;
    private final TestRegistrationRepository registrationRepository;
    private final UserTestAttemptRepository attemptRepository;
    private final NotificationService notificationService;

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

        Test savedTest = testRepository.save(test);
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

            return MyTestDTO.builder()
                    .id(test.getTestId())
                    .title(test.getTestName())
                    .sphere(test.getSphere())
                    .level(test.getLevel())
                    .city(test.getCity())
                    .startTime(test.getStartTime())
                    .status("Active")
                    .candidatesCount(candidates)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<MyTestDTO> getMyCandidateTests(String userEmail) {
        User user = findUserByEmail(userEmail);
        List<TestRegistration> registrations = registrationRepository.findByUser_Id(user.getId());

        return registrations.stream().map(reg -> {
            Test test = reg.getTest();
            return MyTestDTO.builder()
                    .id(test.getTestId())
                    .title(test.getTestName())
                    .sphere(test.getSphere())
                    .level(test.getLevel())
                    .city(test.getCity())
                    .startTime(test.getStartTime())
                    .status("Registered")
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

@Transactional(readOnly = true)
    public TestAnalyticsDTO getTestAnalytics(UUID testId, String authorEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, authorEmail);

        List<UserTestAttempt> attempts = attemptRepository.findByTest_TestId(testId);

        List<UserTestAttempt> completedAttempts = attempts.stream()
                .filter(a -> a.getCompletedAt() != null && a.getScore() != null)
                .collect(Collectors.toList());

        int total = completedAttempts.size();
        int passed = 0;
        int failed = 0;
        double totalScoreSum = 0;

        BigDecimal passingGrade = BigDecimal.valueOf(60);

        for (UserTestAttempt attempt : completedAttempts) {
            totalScoreSum += attempt.getScore().doubleValue();
            
            if (attempt.getScore().compareTo(passingGrade) >= 0) {
                passed++;
            } else {
                failed++;
            }
        }

        double avg = total > 0 ? totalScoreSum / total : 0;

        return TestAnalyticsDTO.builder()
                .totalAttempts(total)
                .passedCount(passed)
                .failedCount(failed)
                .averageScore(Math.round(avg * 100.0) / 100.0) 
                .build();
    }

    private TestDetailResponse mapToDetailResponse(Test test) {
        List<TestQuestion> testQuestions = testQuestionRepository.findByTest_TestId(test.getTestId());
        List<TestDetailResponse.QuestionSummary> questionSummaries = testQuestions.stream()
                .map(tq -> {
                    Question q = tq.getQuestion();
                    return TestDetailResponse.QuestionSummary.builder()
                            .questionId(q.getQuestionId())
                            .questionText(q.getQuestionText())
                            .questionType(q.getQuestionType())
                            .weight(q.getWeight() != null ? q.getWeight() : 1.0)
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

    private CandidateDTO mapAttemptToCandidate(UserTestAttempt attempt) {
        User u = attempt.getUser();
        return CandidateDTO.builder()
                .userId(u.getId())
                .fullName(getFullName(u))
                .email(u.getEmail())
                .profileImageUrl(getAvatarUrl(u))
                .status("COMPLETED")
                .date(attempt.getCompletedAt())
                .score(attempt.getScore())
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