package com.backend.mindspace.controller;

import com.backend.mindspace.dto.SourceUpdateDTO;
import com.backend.mindspace.dto.UploadResponse;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.service.UploadService;
import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    private final UploadService uploadService;
    public UploadController(UploadService uploadService){
        this.uploadService=uploadService;
    }
    @PostMapping("/content/{sessionId}")
    public ResponseEntity<UploadResponse> uploadContent(@AuthenticationPrincipal User user, @PathVariable Long sessionId, @RequestParam(name="file",required = false)MultipartFile file, @RequestParam(name="textContent",required = false) String textContent) throws IOException, TikaException {
        if((file == null || file.isEmpty()) && (textContent == null || textContent.isEmpty())) {
            return ResponseEntity.badRequest().build();
        }

        UploadResponse response = uploadService.processContent(user,sessionId,file, textContent);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/get/{sourceId}")
    public ResponseEntity<UploadResponse> getSourceById(@PathVariable Long sourceId){
        try{
            UploadResponse response = uploadService.getSourceById(sourceId);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{sourceId}")
    public ResponseEntity<UploadResponse> updateSourceTitle(@PathVariable Long sourceId, @RequestBody SourceUpdateDTO sourceUpdateDTO) {
        try {
            com.backend.mindspace.entity.Source updatedSource = uploadService.updateSourceTitle(sourceId, sourceUpdateDTO.getTitle());
            return ResponseEntity.ok(new UploadResponse(updatedSource.getSummary(), updatedSource.getTitle(), updatedSource.getSourceId(), 0)); // Chunk size not needed for this response
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{sourceId}")
    public ResponseEntity<Void> deleteSource(@PathVariable Long sourceId) {
        try {
            uploadService.deleteSource(sourceId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<UploadResponse>> getSourcesBySessionId(@AuthenticationPrincipal User user, @PathVariable Long sessionId) {
        List<UploadResponse> sources = uploadService.getSourcesBySessionId(sessionId, user);
        return ResponseEntity.ok(sources);
    }

}
