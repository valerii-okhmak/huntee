package org.dreamteam.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExportRequestDTO {
    private String format;
    private List<String> columns; 
}