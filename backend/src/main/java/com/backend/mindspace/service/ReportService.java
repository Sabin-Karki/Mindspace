package com.backend.mindspace.service;

import com.backend.mindspace.dto.ReportResponseDTO;
import com.backend.mindspace.entity.ReportGeneration;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.ReportRepository;
import com.backend.mindspace.repository.SourceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        rg.setCreatedAt(LocalDate.now());

        Source sourceToSet = null;
        if(selectedSource.size()==1){
            sourceToSet=selectedSource.getFirst();
        }
        //if multiple sources are selected the fk of the source will be set to null
        rg.setSource(sourceToSet);
        reportRepository.save(rg);


        return new ReportResponseDTO(rg.getReportId(),rg.getReportContent(),rg.getReportTitle(),rg.getSource()!=null?rg.getSource().getSourceId():null);
        //this is list ?? //
//        rg.setSource(selectedSource);
        
        //retrn proper ok //

  }

  public ReportResponseDTO getReportById(Long reportId){
     Long currentUserId=((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
     ReportGeneration existingReport = reportRepository.findById(reportId)
             .orElseThrow(()->new RuntimeException("Report not found with id:" + reportId));

     Long getReportId= existingReport.getReportId();
     String getReportContent= existingReport.getReportContent();
     String getReportTitle= existingReport.getReportTitle();
     Long getReportSourceId=existingReport.getSource()!=null?existingReport.getSource().getSourceId():null;

     return new ReportResponseDTO(getReportId,getReportContent,getReportTitle,getReportSourceId);
  }

  //get reports by session
    public List<ReportResponseDTO> getReportBySessionId(Long sessionId)
    {
        Long currentUserId= ((User)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
        List<ReportGeneration> existingReportForSession = reportRepository.findBySource_ChatSession_SessionIdAndSource_User_UserId(sessionId,currentUserId);
        return existingReportForSession.stream()
                .map(getReport->new ReportResponseDTO(getReport.getReportId(), getReport.getReportContent(), getReport.getReportTitle(), getReport.getSource()!=null?getReport.getSource().getSourceId():null))
                .collect(Collectors.toList());

    }
  @Transactional
    public ReportResponseDTO updateAndSaveReportTitle(Long reportId,String newTitle){
        //need to find current userid
      //finally set the new title
    // the reason i can avoid to implement  a user authentication : only an existing user which was authenticated can create and save the report so adding a user auth could be an overengineering

      ReportGeneration existingReport = reportRepository.findById(reportId)
              .orElseThrow(()->new EntityNotFoundException("Report Not found with id " + reportId));
      existingReport.setReportTitle(newTitle);
      reportRepository.save(existingReport);
      return new ReportResponseDTO(existingReport.getReportId(), existingReport.getReportContent(), existingReport.getReportTitle(), existingReport.getSource()!=null?existingReport.getSource().getSourceId():null);
    }

    public void deleteReport(Long reportId){
        if(!reportRepository.existsById(reportId)){
            throw new EntityNotFoundException("Report not found with id : " + reportId);
        }
        reportRepository.deleteById(reportId);
    }
}
