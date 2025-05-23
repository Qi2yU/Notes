package com.qy.notes.controller;

import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.entity.Note;
import com.qy.notes.model.entity.User;
import com.qy.notes.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Min;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/notes")
    public ApiResponse<List<Note>> searchNotes(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "20") @Min(1) Integer pageSize) {
        return searchService.searchNotes(keyword, page, pageSize);
    }

    @GetMapping("/users")
    public ApiResponse<List<User>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "20") @Min(1) Integer pageSize) {
        return searchService.searchUsers(keyword, page, pageSize);
    }

    @GetMapping("/notes/tag")
    public ApiResponse<List<Note>> searchNotesByTag(
            @RequestParam String keyword,
            @RequestParam String tag,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "20") @Min(1) Integer pageSize) {
        return searchService.searchNotesByTag(keyword, tag, page, pageSize);
    }
} 