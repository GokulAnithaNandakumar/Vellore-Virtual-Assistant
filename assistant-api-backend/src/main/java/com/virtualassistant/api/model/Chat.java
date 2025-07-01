package com.virtualassistant.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "chats")
@Data
public class Chat {
    @Id
    private String id;
    private String userId;
    private List<Message> messages;
    private java.time.Instant lastUpdated;
}
