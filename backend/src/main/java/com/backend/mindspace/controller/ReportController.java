package com.backend.mindspace.controller;

import com.backend.mindspace.dto.ReportRequestDTO;
import com.backend.mindspace.dto.ReportResponseDTO;
import com.backend.mindspace.dto.ReportUpdateDTO;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.service.ReportService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/generate/{sessionId}")
    public ResponseEntity<ReportResponseDTO> generateReport(@AuthenticationPrincipal User user, @PathVariable(name = "sessionId") Long sessionId, @RequestBody ReportRequestDTO reportRequestDTO) {
        try {
            ReportResponseDTO reportResponse = reportService.generateAndSaveReport(user.getUserId(), sessionId, reportRequestDTO.getSourceIds());
            return ResponseEntity.ok(reportResponse);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    //retrieve By Id
    @GetMapping("get/{reportId}")
    public ResponseEntity<ReportResponseDTO> getReportById(@PathVariable Long reportId) {
        ReportResponseDTO reportGetIdResponse = reportService.getReportById(reportId);
        return ResponseEntity.ok(reportGetIdResponse);
    }

    //retrieve by session
    @GetMapping("get/session/{sessionId}")
    public ResponseEntity<List<ReportResponseDTO>> getReportBySessionId(@PathVariable Long sessionId) {
        try {
            List<ReportResponseDTO> reportGetSessionIdResponse = reportService.getReportBySessionId(sessionId);
            return ResponseEntity.ok(reportGetSessionIdResponse);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    //update title
    @PutMapping("/update/{reportId}")
    public ResponseEntity<ReportResponseDTO> updateReport(@PathVariable Long reportId, @RequestBody ReportUpdateDTO reportUpdateDTO) {
        try {
            ReportResponseDTO reportUpdateResponse = reportService.updateAndSaveReportTitle(reportId, reportUpdateDTO.getTitle());
            return ResponseEntity.ok(reportUpdateResponse);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    //delete report id
    @DeleteMapping("/delete/{reportId}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId){
        try{
           reportService.deleteReport(reportId);
           return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}

