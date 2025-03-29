package org.dreamteam.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Operation(summary = "Get Test by ID", description = "Retrieve a specific test using the test ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Test found"),
        @ApiResponse(responseCode = "404", description = "Test not found")
    })
    @GetMapping("/tests")
    public String getTest(@RequestParam String testId) {
        // Your logic here
        return "Test details for " + testId;
    }
}
