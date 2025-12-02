package org.dreamteam.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.dreamteam.Entity.Test;
import org.dreamteam.Entity.User;
import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.TestQuestion;
import org.dreamteam.Entity.TestRegistration;
import org.dreamteam.dto.MyTestDTO;
import org.dreamteam.dto.TestCreateRequest;
import org.dreamteam.dto.TestDetailResponse;
import org.dreamteam.dto.TestSummaryResponse;
import org.dreamteam.dto.TestUpdateRequest;
import org.dreamteam.repository.TestRepository;
import org.dreamteam.repository.TestQuestionRepository;
import org.dreamteam.repository.TestRegistrationRepository;
import org.dreamteam.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException; 
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.lang.Boolean;

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

        Test updatedTest = testRepository.save(test);
        return mapToDetailResponse(updatedTest);
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
            return MyTestDTO.builder()
                    .id(reg.getTest().getTestId())
                    .title(reg.getTest().getTestName())
                    .status("Registered")
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void deleteTest(UUID  testId, String userEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, userEmail);
        testRepository.delete(test);
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
}