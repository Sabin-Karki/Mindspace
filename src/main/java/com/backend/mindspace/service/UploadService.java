package com.backend.mindspace.service;

import com.backend.mindspace.dto.UploadResponse;
import com.backend.mindspace.entity.Chunk;
import com.backend.mindspace.entity.Source;
import com.backend.mindspace.repository.ChunkRepository;
import com.backend.mindspace.repository.SourceRepository;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class UploadService {

    private final  GeminiService geminiService;
    private final SourceRepository sourceRepository;
    private final ChunkRepository chunkRepository;
    public UploadService(GeminiService geminiService, SourceRepository sourceRepository, ChunkRepository chunkRepository){
        this.geminiService=geminiService;
        this.sourceRepository=sourceRepository;
        this.chunkRepository=chunkRepository;
    }

    public UploadResponse processContent(MultipartFile file , String textContent) throws IOException, TikaException {
        // so my goal is that i read through the file and the text content and basically store it as string in some variable,first i also have to recognize the type of file is it ,and then that variable what it will have is the "Source - content" and once it is there,i can call gemini service for ai to generate the title and the summary,and i can also store them into the database then..//use tika to extract pdf or docx  too
            String rawContent = extractText(file,textContent);

            String summary = geminiService.generateSummary(rawContent);
            String title = geminiService.generateTitle(rawContent);

            Source source = new Source();
            source.setTitle(title);
            source.setContent(rawContent);
            source.setSummary(summary);
            source.setFileName(file!=null?file.getOriginalFilename():"No file found");
            source.setCreatedAt(LocalDate.now());
            sourceRepository.save(source);

            //chunking object is to be created here i believe but i want to finish the summary and title ai generation first
        //chunking the source now/the raw content
        List<String> chunks=chunkText(rawContent,420);
        for(String chunkText:chunks){
            float[] embedding = geminiService.generateEmbedding(chunkText);
            Chunk chunk = new Chunk();
            chunk.setChunkText(chunkText);
            chunk.setEmbedding(embedding);
            chunk.setSource(source);
            chunkRepository.save(chunk);

        }
        return new UploadResponse(summary,title,source.getSourceId(),chunks.size());
    }
    private String extractText(MultipartFile file,String textContent)throws IOException,TikaException{
       if(file!=null||!file.isEmpty()){
           String fileName=file.getOriginalFilename();
           if(fileName!=null&&fileName.endsWith(".txt")){
               return new String(file.getBytes(),StandardCharsets.UTF_8);
           }else if(fileName!=null && (fileName.endsWith(".pdf")||fileName.endsWith(".docx"))){
               try(InputStream stream=file.getInputStream()){
               Tika tika= new Tika();
               return tika.parseToString(stream);
           }
       }
    }
       return textContent;

}

private List<String> chunkText(String text,int maxWords){
        String[] words = text.split("\\s+"); //returns array of substring seperated by whitespaces
        List<String> chunks = new ArrayList<>();
        StringBuilder currentChunk = new StringBuilder();
        int count = 0;
        for(String word:words){
            currentChunk.append(word).append(" ");
            count++;
            if(count>=maxWords){
                chunks.add(currentChunk.toString().trim());
                currentChunk=new StringBuilder();
                count = 0;
            }
        }
        if(!currentChunk.isEmpty()){
            chunks.add(currentChunk.toString().trim());
        }
        return chunks;
}
}
