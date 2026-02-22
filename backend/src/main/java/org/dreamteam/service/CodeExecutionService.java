package org.dreamteam.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.dreamteam.Entity.CodeAnswer;
import org.dreamteam.dto.CodeRunResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private static final String PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

    @SuppressWarnings("unchecked")
    public CodeRunResponse runCode(String userCode, CodeAnswer codeAnswer) {
        List<CodeRunResponse.TestCaseResult> results = new ArrayList<>();
        boolean allPassed = true;

        try {
            List<Map<String, Object>> testCases = objectMapper.readValue(
                    codeAnswer.getTestCases(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            for (Map<String, Object> testCase : testCases) {
                List<Object> args = (List<Object>) testCase.get("args");
                String expectedOutput = String.valueOf(testCase.get("expected"));

                String runnableCode = wrapCode(
                        codeAnswer.getLanguage(),
                        codeAnswer.getMethodName(),
                        userCode,
                        args
                );

                String version = getVersionForLanguage(codeAnswer.getLanguage());

                PistonResponse response = webClient.post()
                        .uri(PISTON_API_URL)
                        .bodyValue(new PistonRequest(codeAnswer.getLanguage(), version, runnableCode))
                        .retrieve()
                        .bodyToMono(PistonResponse.class)
                        .block();

                String actualOutput = "";
                String error = null;
                boolean passed = false;

                if (response != null && response.run != null) {
                    if (response.run.stderr != null && !response.run.stderr.isEmpty()) {
                        error = response.run.stderr;
                        allPassed = false;
                    } else {
                        actualOutput = response.run.stdout.trim();
                        passed = actualOutput.equals(expectedOutput);
                        if (!passed) allPassed = false;
                    }
                } else {
                    error = "Execution failed";
                    allPassed = false;
                }

                results.add(CodeRunResponse.TestCaseResult.builder()
                        .input(args.toString())
                        .expectedOutput(expectedOutput)
                        .actualOutput(actualOutput)
                        .passed(passed)
                        .error(error)
                        .build());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return CodeRunResponse.builder().allPassed(false).results(List.of()).build();
        }

        return CodeRunResponse.builder()
                .allPassed(allPassed)
                .results(results)
                .build();
    }

    private String wrapCode(String language, String methodName, String userCode, List<Object> args) {
        String argsString = args.stream()
                .map(arg -> formatArg(arg, language))
                .collect(Collectors.joining(", "));

        switch (language.toLowerCase()) {
            case "java":
                return """
                    import java.util.*;
                    import java.util.stream.*;
                    import java.io.*;
                    
                    public class Main {
                        public static void main(String[] args) {
                            try {
                                Solution sol = new Solution();
                                Object result = sol.%s(%s);
                                if (result instanceof int[]) System.out.print(Arrays.toString((int[])result));
                                else if (result instanceof double[]) System.out.print(Arrays.toString((double[])result));
                                else if (result instanceof boolean[]) System.out.print(Arrays.toString((boolean[])result));
                                else if (result instanceof Object[]) System.out.print(Arrays.deepToString((Object[])result));
                                else System.out.print(result);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    class Solution {
                        %s
                    }
                    """.formatted(methodName, argsString, userCode);

            case "python":
                return """
                    import sys
                    %s
                    try:
                        print(%s(%s), end="")
                    except Exception as e:
                        print(e, file=sys.stderr)
                    """.formatted(userCode, methodName, argsString);

            case "javascript":
                return """
                    %s
                    try {
                        console.log(%s(%s));
                    } catch (e) {
                        console.error(e);
                    }
                    """.formatted(userCode, methodName, argsString);

            default:
                throw new IllegalArgumentException("Unsupported language");
        }
    }

    private String formatArg(Object arg, String language) {
        if (arg == null) return language.equals("python") ? "None" : "null";
        if (arg instanceof String) return "\"" + arg + "\"";
        if (arg instanceof Boolean) {
            boolean val = (Boolean) arg;
            if (language.equals("python")) return val ? "True" : "False";
            return String.valueOf(val);
        }
        if (arg instanceof List) {
            List<?> list = (List<?>) arg;
            String elements = list.stream()
                    .map(item -> formatArg(item, language))
                    .collect(Collectors.joining(", "));
            if (language.equals("java")) return "new ArrayList<>(java.util.Arrays.asList(" + elements + "))";
            else return "[" + elements + "]";
        }
        return String.valueOf(arg);
    }

    private String getVersionForLanguage(String language) {
        return switch (language.toLowerCase()) {
            case "java" -> "15.0.2";
            case "python" -> "3.10.0";
            case "javascript" -> "18.15.0";
            default -> "*";
        };
    }

    @Data
    public static class PistonRequest {
        private String language;
        private String version;
        private List<FileObj> files;
        public PistonRequest(String language, String version, String content) {
            this.language = language;
            this.version = version;
            this.files = List.of(new FileObj(content));
        }
    }

    @Data
    public static class FileObj {
        private String content;
        public FileObj(String content) { this.content = content; }
    }

    @Data
    public static class PistonResponse {
        private RunResult run;
    }

    @Data
    public static class RunResult {
        private String stdout;
        private String stderr;
        private int code;
    }
}