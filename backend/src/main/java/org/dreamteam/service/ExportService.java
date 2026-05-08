package org.dreamteam.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.dreamteam.dto.CandidateDTO;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    public byte[] exportToExcel(String testName, List<String> columns, List<CandidateDTO> data) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Results");

            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.size(); i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns.get(i).toUpperCase());
            }

            int rowIdx = 1;
            for (CandidateDTO candidate : data) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);
                fillExcelRow(row, columns, candidate);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportToPdf(String testName, List<String> columns, List<CandidateDTO> data) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        PdfWriter.getInstance(document, out);
        document.open();
        document.add(new Paragraph("Test Results: " + testName));
        document.add(new Paragraph(" ")); 

        PdfPTable table = new PdfPTable(columns.size());
        
        for (String column : columns) {
            table.addCell(column.toUpperCase());
        }

        for (CandidateDTO candidate : data) {
            for (String col : columns) {
                table.addCell(getFieldValue(col, candidate));
            }
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    private void fillExcelRow(org.apache.poi.ss.usermodel.Row row, List<String> columns, CandidateDTO candidate) {
        for (int i = 0; i < columns.size(); i++) {
            row.createCell(i).setCellValue(getFieldValue(columns.get(i), candidate));
        }
    }

    private String getFieldValue(String column, CandidateDTO c) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

        return switch (column) {
            case "fullName" -> (c.getFullName() != null) ? c.getFullName() : "";
            case "email" -> (c.getEmail() != null) ? c.getEmail() : "";
            case "groupTag" -> (c.getGroupTag() != null && !c.getGroupTag().isEmpty()) ? c.getGroupTag() : "-"; // НОВА КОЛОНКА
            case "score" -> (c.getScore() != null) ? c.getScore().toString() : "N/A";
            case "status" -> (c.getStatus() != null) ? c.getStatus() : "";
            case "date" -> {
                if (c.getDate() == null) yield "";
                    yield c.getDate().format(formatter);
                }            
            default -> "";
        };
    }
}