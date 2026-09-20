package com.campusos.dto;

import com.campusos.model.AnnouncementTarget;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateAnnouncementDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Target audience is required")
    private AnnouncementTarget targetAudience;

    private boolean important;

    public CreateAnnouncementDto() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public AnnouncementTarget getTargetAudience() { return targetAudience; }
    public void setTargetAudience(AnnouncementTarget targetAudience) { this.targetAudience = targetAudience; }

    public boolean isImportant() { return important; }
    public void setImportant(boolean important) { this.important = important; }
}