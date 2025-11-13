package com.backend.mindspace.service;

import com.backend.mindspace.dto.ReportResponseDTO;
import com.backend.mindspace.entity.ReportGeneration;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.repository.ReportRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
//service to generate and save report,the dto which will be sent when post request happened is list of selected source id as a request body,user object /id and session id in url
//using all 3 value,i can basically fetch the correct source object from selected source and than correct user

@Service
public class ReportService {
  private final GeminiService geminiService;
  private final SourceRepository sourceRepository;
  private final ObjectMapper objectMapper;
  private final ReportRepository reportRepository;

    public ReportService(GeminiService geminiService, SourceRepository sourceRepository, ObjectMapper objectMapper, ReportRepository reportRepository) {
        this.geminiService = geminiService;
        this.sourceRepository = sourceRepository;
        this.objectMapper = objectMapper;
        this.reportRepository = reportRepository;
    }

        //you are taking list of sources and 
        //then adding only one source to report??

    public ReportResponseDTO generateAndSaveReport(Long userId, Long sessionId, List<Long> sourceIds){
      List<Source> selectedSource = sourceRepository.findByChatSession_SessionIdAndUser_UserIdAndSourceIdIn(sessionId,userId,sourceIds)
              .orElseThrow(()->new RuntimeException("No sources found for the given session and user." + sourceIds));
      //now i get the list of source  object,say i get 2 source object then it would need to match the size of sourceids sent in requestbody
        if(selectedSource.size()!=sourceIds.size()){
            throw new RuntimeException("Some sources not found for given session and user");
        }
        String combinedContent=selectedSource.stream()
                .map(Source::getContent)
                .collect(Collectors.joining("\n\n--\n\n"));

        String reportTitle = geminiService.generateTitle(combinedContent);
        String reportJson = geminiService.generateReport(combinedContent);

        ReportGeneration rg = new ReportGeneration();
        rg.setReportTitle(reportTitle);
        rg.setReportContent(reportJson);
        
        //this is list ?? //
//        rg.setSource(selectedSource);
        
        //retrn proper ok //
        return new ReportResponseDTO();
  }
}
