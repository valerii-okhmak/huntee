package org.dreamteam.service;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import  org.dreamteam.Entity.Test;
import org.dreamteam.Entity.User;
import org.dreamteam.Entity.Question;
import org.dreamteam.Entity.TestQuestion;
import org.dreamteam.dto.TestCreateRequest;
import org.dreamteam.dto.TestDetailResponse;
import org.dreamteam.dto.TestSummaryResponse;
import org.dreamteam.dto.TestUpdateRequest;
import org.dreamteam.repository.TestRepository;
import org.dreamteam.repository.TestQuestionRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor

public class TestService {
    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final ProfileService profileService;

    @Transactional
    public TestDetailResponse createTest(TestCreateRequest request, String authorEmail){
        User author = profileService.getUserByEmail(authorEmail);

        Test test = new Test(request.getTestName(), author);
        Test savedTest = testRepository.save(test);

        return mapToDetailResponse(savedTest);

    }

    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getAllTests(){
        return testRepository.findAll()
                .stream()
                .map(this:: mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestDetailResponse getTestById(Long testId) {
         Test test = findTestById(testId);
         return mapToDetailResponse(test);
    }

    @Transactional
    public TestDetailResponse updateTest(Long testId, TestUpdateRequest request, String userEmail) {
        Test test = findTestById(testId);
        checkTestOwnership(test, userEmail);
        test.setTestName(request.getTestName());
        Test updatedTest = testRepository.save(test);

        return mapToDetailResponse(updatedTest);
    }

    @Transactional
    public void deleteTest(Long testId, String userEmail){
        Test test = findTestById(testId);
        checkTestOwnership(test, userEmail);
        testRepository.delete(test);
    }

    private TestDetailResponse mapToDetailResponse(Test test){
        List <TestQuestion> testQuestions = testQuestionRepository.findByTest_TestId(test.getTestId());

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
                 .authorUsername(test.getUser().getUsername())
                 .questions(questionSummaries)
                 .build();
    }

     private TestSummaryResponse mapToSummaryResponse(Test test) {
        int count = (int) testQuestionRepository.countByTest_TestId(test.getTestId());

        return TestSummaryResponse.builder()
                 .testId(test.getTestId())
                 .testName(test.getTestName())
                 .authorUsername(test.getUser().getUsername())
                 .questionCount(count)
                 .build();
     }

     private Test findTestById(Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));
    }

    private void checkTestOwnership(Test test, String email) {
        if (!test.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to modify or delete this test.");
        }
    }
}
