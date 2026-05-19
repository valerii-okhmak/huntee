package org.dreamteam.service;

import java.io.BufferedReader;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import java.nio.charset.StandardCharsets;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStreamReader;
import java.util.ArrayList;

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

import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final UserRepository userRepository;
    private final TestLevelRepository testLevelRepository;

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByTestId(UUID testId, String userEmail) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        checkTestOwnership(test, userEmail);

        Set<TestQuestion> testQuestions = test.getTestQuestions();
        
        if (testQuestions == null || testQuestions.isEmpty()) {
            return new ArrayList<>();
        }

        return testQuestions.stream()
                .sorted((tq1, tq2) -> Integer.compare(tq1.getOrderIndex(), tq2.getOrderIndex()))
                .map(testQuestion -> mapToQuestionResponse(testQuestion.getQuestion()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Question createQuestionAndLinkToTest(UUID testId, QuestionCreateRequest request, String authorEmail) {
        
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        if (!test.getUser().getEmail().equals(authorEmail)) {
            throw new AccessDeniedException("You do not have permission to add questions to this test.");
        }
        
        User author = findUserByEmail(authorEmail);

        Question question = new Question();
        question.setAuthor(author);
        mapToQuestion(question, request);
        processQuestionAnswers(question, request);

        Question savedQuestion = questionRepository.save(question);

        int orderIndex = (test.getTestQuestions() != null) ? test.getTestQuestions().size() + 1 : 1;
        TestQuestion testQuestion = new TestQuestion(test, savedQuestion, orderIndex);
        testQuestionRepository.save(testQuestion);

        return savedQuestion;
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionDetails(UUID questionId) {
        Question question = findQuestionById(questionId);
        return mapToQuestionResponse(question);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getAllQuestionsByAuthor(String authorEmail) {
        List<Question> questions = questionRepository.findAllByAuthor_Email(authorEmail);
        return questions.stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionResponse updateQuestion(UUID questionId, QuestionUpdateRequest request, String authorEmail) {
        Question question = findQuestionById(questionId);
        checkQuestionOwnership(question, authorEmail);
        mapToQuestion(question, request);
        clearExistingAnswers(question);
        processQuestionAnswers(question, request);

        Question updatedQuestion = questionRepository.save(question);
        return mapToQuestionResponse(updatedQuestion);
    }
 
    @Transactional
    public QuestionResponse duplicateQuestion(UUID questionId, String authorEmail){
        Question originalQuestion = findQuestionById(questionId);
        User author = findUserByEmail(authorEmail);
        Question copyQuestion = new Question();
        copyQuestion.setAuthor(author);
        copyQuestion.setCustomWeight(originalQuestion.getCustomWeight());
        copyQuestion.setComment(originalQuestion.getComment());
        copyQuestion.setImageUrl(originalQuestion.getImageUrl());
        copyQuestion.setQuestionText(originalQuestion.getQuestionText());
        copyQuestion.setQuestionType(originalQuestion.getQuestionType());
        copyQuestion.setCategories(new HashSet<>(originalQuestion.getCategories()));
        copyQuestion.setTestLevel(originalQuestion.getTestLevel()); 
        
        switch(originalQuestion.getQuestionType()){
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
                if (originalQuestion.getChoiceOptions() != null) {
                    Set<ChoiceOption> clonedOptions = originalQuestion.getChoiceOptions().stream()
                            .map(o -> new ChoiceOption(copyQuestion, o.getOptionText(), o.isCorrect()))
                            .collect(Collectors.toSet());
                    copyQuestion.setChoiceOptions(clonedOptions);
                }
                break;
            
            case TEXT:
                TextAnswer originalText = originalQuestion.getTextAnswer();
                if (originalText != null){
                    copyQuestion.setTextAnswer(new TextAnswer(copyQuestion, originalText.getCorrectText(), originalText.isCaseSensitive()));
                }
                break;
            
            case MATCHING:
                if (originalQuestion.getMatchingPairs() != null) {
                    Set<MatchingPair> clonedPairs = originalQuestion.getMatchingPairs().stream()
                            .map(p -> new MatchingPair(copyQuestion, p.getPrompt(), p.getAnswer()))
                            .collect(Collectors.toSet());
                    copyQuestion.setMatchingPairs(clonedPairs);
                }
                break;
            
            case CODE:
                CodeAnswer oldCode = originalQuestion.getCodeAnswer();
                if (oldCode != null) {
                    copyQuestion.setCodeAnswer(new CodeAnswer(
                            copyQuestion, oldCode.getTemplateCode(), oldCode.getTestCases(), 
                            oldCode.getLanguage(), oldCode.getMethodName()
                    ));
                }
                break;
        }
        Question savedQuestion = questionRepository.save(copyQuestion);
        return mapToQuestionResponse(savedQuestion);
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

    @Transactional
    public int importQuestions(UUID testId, MultipartFile file, String authorEmail) throws Exception{
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty.");
        }

        List<QuestionCreateRequest> questionRequests;
        String contentType = file.getContentType();

        if(contentType != null && contentType.equals("application/json")){
            questionRequests = parseJsonFile(file);
        }
        else if(contentType != null && (contentType.equals("text/csv") || file.getOriginalFilename().endsWith(".csv"))){
            questionRequests = parseCsvFile(file);
        }
        else {
            throw new IllegalArgumentException("Unsupported file format. Please use JSON or CSV.");
            
        }
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + authorEmail));
         
        List<Question> questionsToSave = new ArrayList<>();
        List <TestQuestion> testQuestions = new ArrayList<>();

        for(QuestionCreateRequest request : questionRequests){
            validateQuestionRequest(request);
            Question question = new Question();
            question.setAuthor(author);
            mapToQuestion(question, request);
            processQuestionAnswers(question, request);
            questionsToSave.add(question);
        }
        List<Question> savedQuestions = questionRepository.saveAll(questionsToSave);
        int currentOrderIndex = (test.getTestQuestions() != null) ? test.getTestQuestions().size() + 1 : 1;
        for(Question savedQuestion : savedQuestions){
            TestQuestion testQuestion = new TestQuestion(test, savedQuestion, currentOrderIndex++);
            testQuestions.add(testQuestion);
        }
        testQuestionRepository.saveAll(testQuestions);
        return savedQuestions.size();
    }

    private List<QuestionCreateRequest> parseJsonFile(MultipartFile file) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(file.getInputStream(),
                new TypeReference<List<QuestionCreateRequest>>() {});
    }

    private List<QuestionCreateRequest> parseCsvFile(MultipartFile file) throws Exception {
        List<QuestionCreateRequest> questionRequests = new ArrayList<>();
        try(BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(),StandardCharsets.UTF_8))){
            String line;
            boolean isHeader = true;
            while((line = reader.readLine()) != null){
                if(isHeader){
                    isHeader = false;
                    continue;
                }
                String[] parts = line.split(";");
                if(parts.length < 2) continue; 
                
                QuestionCreateRequest request = new QuestionCreateRequest();
                request.setQuestionType(QuestionType.valueOf(parts[0].toUpperCase()));
                request.setQuestionText(parts[1]);
                
                if(parts.length >= 4 && (request.getQuestionType() == QuestionType.SINGLE_CHOICE || request.getQuestionType() == QuestionType.MULTIPLE_CHOICE)){
                    String[] options = parts[2].split("\\|");
                    String[] corrects = parts[3].split("\\|");
                    List<ChoiceOptionDTO> choiceDtos =  new ArrayList<>();

                    for(String option : options){
                        boolean isCorrect = false;
                        for(String correct : corrects){
                            if(option.equalsIgnoreCase(correct.trim())){
                                isCorrect = true;
                                break;
                            }
                            ChoiceOptionDTO dto = new ChoiceOptionDTO();
                            dto.setOptionText(option);
                            dto.setCorrect(isCorrect);
                            choiceDtos.add(dto);
                        }
                    request.setChoiceOptions(choiceDtos);
                    }  
                }

                if(parts.length >= 3 && request.getQuestionType() == QuestionType.TEXT){
                    TextAnswerDTO textDto = new TextAnswerDTO();
                    textDto.setCorrectText(parts[2]);
                    textDto.setCaseSensitive(false); 
                    request.setTextAnswer(textDto);
                }
                
                questionRequests.add(request);
            }
            return questionRequests;

        }
    }
    
    private void validateQuestionRequest(QuestionCreateRequest request) {
        if (request.getQuestionText() == null || request.getQuestionText().isEmpty()) {
            throw new IllegalArgumentException("Question text cannot be empty.");
        }
        if (request.getQuestionType() == null) {
            throw new IllegalArgumentException("Question type must be specified.");
        }

        switch (request.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
                validateChoiceOptions(request.getChoiceOptions(), true);
                break;
            case TEXT:
                validateChoiceOptions(request.getChoiceOptions(), false);
                break;
            case MATCHING:
                if (request.getMatchingPairs() == null || request.getMatchingPairs().size() < 2) {
                    throw new IllegalArgumentException("Для типу MATCHING необхідно мінімум 2 пари (matchingPairs).");
                }
                for (int i = 0; i < request.getMatchingPairs().size(); i++) {
                    var pair = request.getMatchingPairs().get(i);
                    if (pair.getPrompt() == null || pair.getPrompt().trim().isEmpty() ||
                        pair.getAnswer() == null || pair.getAnswer().trim().isEmpty()) {
                        throw new IllegalArgumentException("Пара #" + (i + 1) + " неповна: і запитання (prompt), і відповідь (answer) мають бути заповнені.");
                    }
                }
                break;
            case CODE:
                if (request.getCodeAnswer() == null) {
                    throw new IllegalArgumentException("Для типу CODE необхідний об'єкт codeAnswer.");
                }
                if (request.getCodeAnswer().getTestCases() == null || request.getCodeAnswer().getTestCases().isEmpty()) {
                     throw new IllegalArgumentException("Для типу CODE необхідно надати хоча б один тест-кейс (testCases).");
                }
                break;
            default:
                throw new IllegalArgumentException("Unsupported question type: " + request.getQuestionType());
        }
    }

    private void validateChoiceOptions(List<ChoiceOptionDTO> options, boolean isSingleChoice) {
        if (options == null || options.size() < 2) {
            throw new IllegalArgumentException("Питання з вибором варіантів повинно мати мінімум 2 опції.");
        }

        Long correctCount = options.stream().filter(ChoiceOptionDTO::isCorrect).count();

        if (correctCount == 0) {
            throw new IllegalArgumentException("Питання повинно мати хоча б один правильний варіант.");
        }

        if (isSingleChoice && correctCount > 1) {
            throw new IllegalArgumentException("Питання типу SINGLE_CHOICE може мати тільки один правильний варіант.");
        }
    }

    private void mapToQuestion(Question question, QuestionCreateRequest request) {
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setComment(request.getComment());
        question.setCustomWeight(request.getCustomWeight() != null ? request.getCustomWeight() : null);
        question.setCategories(request.getCategories() != null ? request.getCategories() : new HashSet<>());
        if (request.getLevelId() != null) {
            TestLevel level = testLevelRepository.findById(request.getLevelId())
                    .orElseThrow(() -> new EntityNotFoundException("Рівень не знайдено"));
            question.setTestLevel(level);
        }
    }

    private void mapToQuestion(Question question, QuestionUpdateRequest request) {
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());
        question.setComment(request.getComment());
        question.setCustomWeight(request.getCustomWeight() != null ? request.getCustomWeight() : question.getCustomWeight());
        question.setCategories(request.getCategories() != null ? request.getCategories() : question.getCategories());
        if (request.getLevelId() != null) {
            TestLevel level = testLevelRepository.findById(request.getLevelId())
                    .orElseThrow(() -> new EntityNotFoundException("Рівень не знайдено"));
            question.setTestLevel(level);
        }
    }

    private QuestionResponse mapToQuestionResponse(Question question) {
        QuestionResponse.QuestionResponseBuilder builder = QuestionResponse.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .comment(question.getComment())
                .questionType(question.getQuestionType())
                .customWeight(question.getCustomWeight())
                .authorEmail(question.getAuthor().getUsername())
                .categories(question.getCategories())
                // ВИПРАВЛЕНО: getId() замість getLevelId()
                .levelId(question.getTestLevel() != null ? question.getTestLevel().getId() : null);

        switch (question.getQuestionType()) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE:
                if (question.getChoiceOptions() != null) {
                    builder.choiceOptions(question.getChoiceOptions().stream()
                            .map(o -> new ChoiceOptionDTO(o.getOptionText(), o.getImageUrl(), o.isCorrect()))
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