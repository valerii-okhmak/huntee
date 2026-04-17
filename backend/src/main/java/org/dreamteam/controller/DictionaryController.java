package org.dreamteam.controller;

import org.dreamteam.dto.DictionaryResponseDto;
import org.dreamteam.service.DictionaryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dictionaries")
public class DictionaryController {

    private final DictionaryService dictionaryService;

    public DictionaryController(DictionaryService dictionaryService) {
        this.dictionaryService = dictionaryService;
    }

    @GetMapping
    public DictionaryResponseDto getDictionaries() {
        return dictionaryService.getDictionaries();
    }
}