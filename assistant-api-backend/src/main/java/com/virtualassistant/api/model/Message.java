package com.virtualassistant.api.model;

import lombok.Data;
import java.time.Instant;

@Data
public class Message {
    private String sender; // "user" or "assistant"
    private String content;
    private Instant timestamp;
}
