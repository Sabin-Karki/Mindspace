package com.backend.mindspace.controller;

import com.backend.mindspace.dto.UploadResponse;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.service.UploadService;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    private final UploadService uploadService;
    public UploadController(UploadService uploadService){
        this.uploadService=uploadService;
    }
    @PostMapping("/content/{sessionId}")
    public ResponseEntity<UploadResponse> uploadContent(@AuthenticationPrincipal User user, @PathVariable Long sessionId, @RequestParam(name="file",required = false)MultipartFile file, @RequestParam(name="textContent",required = false) String testContent ) throws IOException, TikaException {
        if(file==null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        else if(testContent==null || testContent.isEmpty()){
            return ResponseEntity.badRequest().build();
            }
             UploadResponse response = uploadService.processContent(user,sessionId,file,testContent);
        return ResponseEntity.ok(response);

    }
}
