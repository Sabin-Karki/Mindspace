package com.backend.mindspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

    private String summary;
    private String title;
    private Long sourceId;
    private int chunksSize;
}
