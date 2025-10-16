package com.backend.mindspace.controller;

import com.backend.mindspace.dto.UploadResponse;
import com.backend.mindspace.service.UploadService;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService;
    public UploadController(UploadService uploadService){
        this.uploadService=uploadService;
    }
    @PostMapping("/content")
    public ResponseEntity<UploadResponse> uploadContent(@RequestParam(name="file",required = false)MultipartFile file, @RequestParam(name="textContent",required = false) String testContent ) throws IOException, TikaException {
        if(file==null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        else if(testContent==null || testContent.isEmpty()){
            return ResponseEntity.badRequest().build();
            }
             UploadResponse response = uploadService.processContent(file,testContent);
        return ResponseEntity.ok(response);

    }
}
