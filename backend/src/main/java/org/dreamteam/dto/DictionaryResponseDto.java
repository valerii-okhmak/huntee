package org.dreamteam.dto;

import java.util.List;

public record DictionaryResponseDto(
    List<DictionaryItemDto> cities,
    List<DictionaryItemDto> levels,
    List<DictionaryItemDto> fields
) {}