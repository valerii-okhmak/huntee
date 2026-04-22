package org.dreamteam.service;

import org.dreamteam.Entity.QuestionType;
import org.dreamteam.dto.ChoiceOptionImportDTO;
import org.dreamteam.dto.QuestionImportDTO;
import org.dreamteam.dto.TextAnswerImportDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionImportService {

    public List<QuestionImportDTO> parseImportFile(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        if (fileName == null) throw new IllegalArgumentException("File name is null");

        if (fileName.toLowerCase().endsWith(".xml")) {
            return parseMoodleXml(file);
        } else if (fileName.toLowerCase().endsWith(".txt")) {
            // Читаємо файл, щоб зрозуміти, чи це GIFT, чи Aiken
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            if (content.contains("{") && content.contains("}")) {
                return parseGift(content);
            } else {
                return parseAiken(content);
            }
        }
        throw new IllegalArgumentException("Unsupported file format. Please use .xml or .txt");
    }

    // ============================
    // 1. AIKEN PARSER
    // ============================
    private List<QuestionImportDTO> parseAiken(String content) {
        List<QuestionImportDTO> questions = new ArrayList<>();
        String[] lines = content.split("\\r?\\n");
        
        String questionText = null;
        List<String> options = new ArrayList<>();
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;

            if (line.startsWith("ANSWER:")) {
                // Визначаємо правильну відповідь (наприклад, ANSWER: A)
                String correctAnswerLetter = line.replace("ANSWER:", "").trim();
                int correctIndex = correctAnswerLetter.charAt(0) - 'A';

                List<ChoiceOptionImportDTO> choiceOptions = new ArrayList<>();
                for (int i = 0; i < options.size(); i++) {
                    // Видаляємо "A) ", "B. " з початку варіанту
                    String optText = options.get(i).replaceFirst("^[A-Z][\\)\\.]\\s*", "");
                    choiceOptions.add(ChoiceOptionImportDTO.builder()
                            .optionText(optText)
                            .isCorrect(i == correctIndex)
                            .orderIndex(i)
                            .build());
                }

                questions.add(QuestionImportDTO.builder()
                        .questionText(questionText)
                        .questionType(QuestionType.SINGLE_CHOICE)
                        .points(1.0)
                        .choiceOptions(choiceOptions)
                        .build());

                questionText = null;
                options.clear();
            } else if (line.matches("^[A-Z][\\)\\.].*")) {
                // Це варіант відповіді
                options.add(line);
            } else {
                // Це текст питання
                if (questionText == null) {
                    questionText = line;
                } else {
                    questionText += "\n" + line;
                }
            }
        }
        return questions;
    }

    // ============================
    // 2. GIFT PARSER (Оновлений)
    // ============================
    private List<QuestionImportDTO> parseGift(String content) {
        List<QuestionImportDTO> questions = new ArrayList<>();
        String[] blocks = content.split("\\n\\s*\\n");

        for (String block : blocks) {
            block = block.trim();
            if (block.isEmpty() || block.startsWith("//")) continue;

            int startBracket = block.indexOf('{');
            int endBracket = block.indexOf('}');

            if (startBracket != -1 && endBracket != -1) {
                String questionText = block.substring(0, startBracket).trim();
                questionText = questionText.replaceAll("^::.*?::\\s*", "");

                String answersPart = block.substring(startBracket + 1, endBracket).trim();
                
                if (answersPart.equals("T") || answersPart.equals("TRUE") || answersPart.equals("F") || answersPart.equals("FALSE")) {
                    boolean isTrue = answersPart.startsWith("T");
                    List<ChoiceOptionImportDTO> options = List.of(
                            ChoiceOptionImportDTO.builder().optionText("True").isCorrect(isTrue).orderIndex(0).build(),
                            ChoiceOptionImportDTO.builder().optionText("False").isCorrect(!isTrue).orderIndex(1).build()
                    );
                    questions.add(QuestionImportDTO.builder().questionText(questionText).questionType(QuestionType.SINGLE_CHOICE).points(1.0).choiceOptions(options).build());
                    continue;
                }

                String[] rawOptions = answersPart.split("(?=[=~])");
                List<ChoiceOptionImportDTO> choiceOptions = new ArrayList<>();
                int order = 0;
                int correctCount = 0;
                boolean hasTilde = false; // Прапорець для перевірки наявності неправильних відповідей

                for (String opt : rawOptions) {
                    opt = opt.trim();
                    if (opt.isEmpty()) continue;
                    
                    if (opt.startsWith("~")) hasTilde = true;

                    boolean isCorrect = opt.startsWith("=");
                    
                    // Обробка відсотків для Moodle GIFT (~%50% або ~%-100%)
                    if (opt.startsWith("~%")) {
                        try {
                            String weightStr = opt.substring(2, opt.indexOf("%", 2));
                            double weight = Double.parseDouble(weightStr);
                            if (weight > 0) isCorrect = true; // Якщо відсоток > 0, вважаємо це правильною відповіддю
                        } catch (Exception e) {}
                    }

                    String text = opt.substring(1).replaceAll("^%[\\d-]+%\\s*", "").trim();
                    
                    if (isCorrect) correctCount++;

                    choiceOptions.add(ChoiceOptionImportDTO.builder()
                            .optionText(text)
                            .isCorrect(isCorrect)
                            .orderIndex(order++)
                            .build());
                }

                // ЛОГІКА ВИЗНАЧЕННЯ ТИПУ ПИТАННЯ
                if (!hasTilde && correctCount > 0) {
                    // Якщо немає '~', а є тільки '=' — це ВІДКРИТА ВІДПОВІДЬ (Short Answer)
                    TextAnswerImportDTO textAnswer = TextAnswerImportDTO.builder()
                            .correctText(choiceOptions.get(0).getOptionText()) // Беремо перший збіг як правильний текст
                            .isCaseSensitive(false)
                            .build();

                    questions.add(QuestionImportDTO.builder()
                            .questionText(questionText)
                            .questionType(QuestionType.TEXT)
                            .points(1.0)
                            .textAnswer(textAnswer)
                            .build());
                } else {
                    // Якщо є '~' — це ОДИНОЧНИЙ або МНОЖИННИЙ вибір
                    QuestionType type = correctCount > 1 ? QuestionType.MULTIPLE_CHOICE : QuestionType.SINGLE_CHOICE;

                    questions.add(QuestionImportDTO.builder()
                            .questionText(questionText)
                            .questionType(type)
                            .points(1.0)
                            .choiceOptions(choiceOptions)
                            .build());
                }
            }
        }
        return questions;
    }

    // ============================
    // 3. MOODLE XML PARSER
    // ============================
    private List<QuestionImportDTO> parseMoodleXml(MultipartFile file) throws Exception {
        List<QuestionImportDTO> questions = new ArrayList<>();
        
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(file.getInputStream());
        doc.getDocumentElement().normalize();

        NodeList questionNodes = doc.getElementsByTagName("question");

        for (int i = 0; i < questionNodes.getLength(); i++) {
            Node node = questionNodes.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) node;
                String type = element.getAttribute("type");
                
                // Ігноруємо системні категорії
                if ("category".equals(type)) continue;

                String questionText = getTagValue("questiontext", element);

                if ("multichoice".equals(type) || "truefalse".equals(type)) {
                    NodeList answerNodes = element.getElementsByTagName("answer");
                    List<ChoiceOptionImportDTO> options = new ArrayList<>();
                    int correctCount = 0;

                    for (int j = 0; j < answerNodes.getLength(); j++) {
                        Element ansElement = (Element) answerNodes.item(j);
                        String fractionStr = ansElement.getAttribute("fraction");
                        boolean isCorrect = fractionStr.equals("100") || (Double.parseDouble(fractionStr) > 0);
                        if (isCorrect) correctCount++;

                        String ansText = getTagValue("text", ansElement);
                        
                        options.add(ChoiceOptionImportDTO.builder()
                                .optionText(ansText)
                                .isCorrect(isCorrect)
                                .orderIndex(j)
                                .build());
                    }

                    QuestionType qType = ("multichoice".equals(type) && correctCount > 1) 
                            ? QuestionType.MULTIPLE_CHOICE 
                            : QuestionType.SINGLE_CHOICE;

                    questions.add(QuestionImportDTO.builder()
                            .questionText(questionText)
                            .questionType(qType)
                            .points(1.0)
                            .choiceOptions(options)
                            .build());

                } else if ("shortanswer".equals(type)) {
                    NodeList answerNodes = element.getElementsByTagName("answer");
                    if (answerNodes.getLength() > 0) {
                        Element ansElement = (Element) answerNodes.item(0); // Беремо першу правильну
                        String ansText = getTagValue("text", ansElement);

                        TextAnswerImportDTO textAnswer = TextAnswerImportDTO.builder()
                                .correctText(ansText)
                                .isCaseSensitive(false)
                                .build();

                        questions.add(QuestionImportDTO.builder()
                                .questionText(questionText)
                                .questionType(QuestionType.TEXT)
                                .points(1.0)
                                .textAnswer(textAnswer)
                                .build());
                    }
                }
            }
        }
        return questions;
    }

    private String getTagValue(String tag, Element element) {
        NodeList nodeList = element.getElementsByTagName(tag);
        if (nodeList != null && nodeList.getLength() > 0) {
            Element targetElement = (Element) nodeList.item(0);
            NodeList textNodes = targetElement.getElementsByTagName("text");
            if (textNodes != null && textNodes.getLength() > 0) {
                return textNodes.item(0).getTextContent().replaceAll("<[^>]*>", "").trim(); // Видаляємо HTML теги
            }
            return targetElement.getTextContent().trim();
        }
        return "";
    }
}