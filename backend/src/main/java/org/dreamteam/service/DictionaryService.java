package org.dreamteam.service;

import org.dreamteam.dto.DictionaryItemDto;
import org.dreamteam.dto.DictionaryResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DictionaryService {

    public DictionaryResponseDto getDictionaries() {
        
        List<DictionaryItemDto> cities = List.of(
            new DictionaryItemDto("kyiv", "Київ"),
            new DictionaryItemDto("lviv", "Львів"),
            new DictionaryItemDto("odesa", "Одеса"),
            new DictionaryItemDto("dnipro", "Дніпро"),
            new DictionaryItemDto("kharkiv", "Харків"),
            new DictionaryItemDto("ternopil", "Тернопіль"),
            new DictionaryItemDto("ivano-frankivsk", "Івано-Франківськ"),
            new DictionaryItemDto("lutsk", "Луцьк"),
            new DictionaryItemDto("rivne", "Рівне"),
            new DictionaryItemDto("uzhhorod", "Ужгород"),
            new DictionaryItemDto("online", "Онлайн / Remote")
        );

        List<DictionaryItemDto> levels = List.of(
            new DictionaryItemDto("trainee", "Trainee"),
            new DictionaryItemDto("junior", "Junior"),
            new DictionaryItemDto("middle", "Middle"),
            new DictionaryItemDto("senior", "Senior"),
            new DictionaryItemDto("other", "Інше")
        );

        List<DictionaryItemDto> fields = List.of(
            new DictionaryItemDto("frontend", "Frontend"),
            new DictionaryItemDto("backend", "Backend"),
            new DictionaryItemDto("fullstack", "Fullstack"),
            new DictionaryItemDto("mobile", "Mobile"),
            new DictionaryItemDto("devops", "DevOps / SysAdmin"),
            new DictionaryItemDto("qa", "QA"),
            new DictionaryItemDto("design", "UI/UX Design"),
            new DictionaryItemDto("data", "Data Science / Analytics"),
            new DictionaryItemDto("other", "Інше")
        );

        return new DictionaryResponseDto(cities, levels, fields);
    }
}