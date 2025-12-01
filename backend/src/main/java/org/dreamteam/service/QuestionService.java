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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final UserRepository userRepository;
    private final ChoiceOptionRepository choiceOptionRepository;
    private final TextAnswerRepository textAnswerRepository;
    private final MatchingPairRepository matchingPairRepository;
    private final CodeAnswerRepository codeAnswerRepository;

    @Transactional
    public Question createQuestionAndLinkToTest(UUID testId, QuestionCreateRequest request, String authorEmail) {
        
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        if (!test.getUser().getEmail().equals(authorEmail)) {
            throw new AccessDeniedException("You do not have permission to add questions to this test.");
        }
        
        User author = findUserByEmail(authorEmail);

        Question question = new Question(request.getQuestionText(), request.getQuestionType(), author);
        question.setComment(request.getComment());
        
        processQuestionAnswers(question, request);

        Question savedQuestion = questionRepository.save(question);

        TestQuestion testQuestion = new TestQuestion(test, savedQuestion);
        testQuestionRepository.save(testQuestion);

        return savedQuestion;
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionDetails(UUID questionId) {
        Question question = findQuestionById(questionId);
        return mapToQuestionResponse(question);
    }

    @Transactional
    public QuestionResponse updateQuestion(UUID questionId, QuestionUpdateRequest request, String authorEmail) {
        Question question = findQuestionById(questionId);
        checkQuestionOwnership(question, authorEmail);

        question.setQuestionText(request.getQuestionText());
        question.setComment(request.getComment());
        
        clearExistingAnswers(question);
        processQuestionAnswers(question, request);

        Question updatedQuestion = questionRepository.save(question);
        return mapToQuestionResponse(updatedQuestion);
    }

    @Transactional
    public void deleteQuestion(UUID questionId, String authorEmail) {
        Question question = findQuestionById(questionId);
        checkQuestionOwnership(question, authorEmail);
        
        questionRepository.delete(question);
    }

    @Transactional
    public void unlinkQuestionFromTest(UUID testId, UUID questionId, String authorEmail) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));
        checkTestOwnership(test, authorEmail);

        TestQuestion testQuestion = testQuestionRepository.findByTest_TestIdAndQuestion_QuestionId(testId, questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question is not linked to this test."));
        
        testQuestionRepository.delete(testQuestion);
    }

    private void processQuestionAnswers(Question question, QuestionCreateRequest request) {
        switch (request.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
                createChoiceOptions(question, request.getChoiceOptions());
                break;
            case TEXT:
                createTextAnswer(question, request.getTextAnswer());
                break;
            case MATCHING:
                createMatchingPairs(question, request.getMatchingPairs());
                break;
            case CODE:
                createCodeAnswer(question, request.getCodeAnswer());
                break;
            default:
                throw new IllegalArgumentException("Unsupported question type: " + request.getQuestionType());
        }
    }
    
    private void processQuestionAnswers(Question question, QuestionUpdateRequest request) {
         switch (question.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
                createChoiceOptions(question, request.getChoiceOptions());
                break;
            case TEXT:
                createTextAnswer(question, request.getTextAnswer());
                break;
            case MATCHING:
                createMatchingPairs(question, request.getMatchingPairs());
                break;
            case CODE:
                createCodeAnswer(question, request.getCodeAnswer());
                break;
            default:
                throw new IllegalArgumentException("Unsupported question type: " + question.getQuestionType());
        }
    }
    
    private void clearExistingAnswers(Question question) {
        question.getChoiceOptions().clear();
        question.getMatchingPairs().clear();
        
        if (question.getTextAnswer() != null) {
            question.setTextAnswer(null);
        }
        if (question.getCodeAnswer() != null) {
            question.setCodeAnswer(null);
        }
        questionRepository.saveAndFlush(question); 
    }

    private void createChoiceOptions(Question question, List<ChoiceOptionDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) throw new IllegalArgumentException("Choice options are required.");
        Set<ChoiceOption> options = new HashSet<>();
        for (ChoiceOptionDTO dto : dtos) {
            options.add(new ChoiceOption(question, dto.getOptionText(), dto.isCorrect()));
        }
        question.setChoiceOptions(options);
    }

    private void createTextAnswer(Question question, TextAnswerDTO dto) {
        if (dto == null) throw new IllegalArgumentException("Text answer is required.");
        TextAnswer answer = new TextAnswer(question, dto.getCorrectText(), dto.isCaseSensitive());
        question.setTextAnswer(answer);
    }

    private void createMatchingPairs(Question question, List<MatchingPairDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) throw new IllegalArgumentException("Matching pairs are required.");
        Set<MatchingPair> pairs = new HashSet<>();
        for (MatchingPairDTO dto : dtos) {
            pairs.add(new MatchingPair(question, dto.getPrompt(), dto.getAnswer()));
        }
        question.setMatchingPairs(pairs);
    }
    
    private void createCodeAnswer(Question question, CodeAnswerDTO dto) {
        if (dto == null) throw new IllegalArgumentException("Code answer details are required.");
        CodeAnswer answer = new CodeAnswer(
            question, 
            dto.getTemplateCode(), 
            dto.getTestCases(),
            dto.getLanguage(),
            dto.getMethodName()
        );
        question.setCodeAnswer(answer);
    }

    private Question findQuestionById(UUID questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));
    }

    private void checkQuestionOwnership(Question question, String email) {
        if (!question.getAuthor().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not the author of this question.");
        }
    }
    
    private void checkTestOwnership(Test test, String email) {
        if (!test.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not the author of this test.");
        }
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
    
    private QuestionResponse mapToQuestionResponse(Question question) {
        QuestionResponse.QuestionResponseBuilder builder = QuestionResponse.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .comment(question.getComment())
                .questionType(question.getQuestionType())
                .authorEmail(question.getAuthor().getUsername());

        switch (question.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
                if (question.getChoiceOptions() != null) {
                    builder.choiceOptions(question.getChoiceOptions().stream()
                            .map(o -> new ChoiceOptionDTO(o.getOptionText(), o.isCorrect()))
                            .collect(Collectors.toList()));
                }
                break;
            case TEXT:
                if (question.getTextAnswer() != null) {
                    TextAnswer ta = question.getTextAnswer();
                    builder.textAnswer(new TextAnswerDTO(ta.getCorrectText(), ta.isCaseSensitive()));
                }
                break;
            case MATCHING:
                 if (question.getMatchingPairs() != null) {
                    builder.matchingPairs(question.getMatchingPairs().stream()
                            .map(p -> new MatchingPairDTO(p.getPrompt(), p.getAnswer()))
                            .collect(Collectors.toList()));
                 }
                break;
            case CODE:
                if (question.getCodeAnswer() != null) {
                    CodeAnswer ca = question.getCodeAnswer();
                    builder.codeAnswer(new CodeAnswerDTO(ca.getTemplateCode(), ca.getTestCases(), ca.getLanguage(), ca.getMethodName()));
                }
                break;
        }
        return builder.build();
    }
}