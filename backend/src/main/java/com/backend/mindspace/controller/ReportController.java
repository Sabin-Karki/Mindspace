package com.backend.mindspace.controller;

import com.backend.mindspace.dto.ReportRequestDTO;
import com.backend.mindspace.dto.ReportResponseDTO;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/generate")
public class ReportController {
    private final ReportService reportService;
    public ReportController(ReportService reportService){
        this.reportService=reportService;
    }

    @PostMapping("/report/{sessionId}")
    public ResponseEntity<ReportResponseDTO> generateReport(@AuthenticationPrincipal User user, @PathVariable(name="sessionId") Long sessionId, @RequestBody ReportRequestDTO reportRequestDTO){
        try{
            ReportResponseDTO reportResponse = reportService.generateAndSaveReport(user.getUserId(),sessionId,reportRequestDTO.getSourceIds());
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
		return null;
    }
}
