package com.virtualassistant.api.controller;

import com.virtualassistant.api.model.Chat;
import com.virtualassistant.api.model.Message;
import com.virtualassistant.api.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatRepository chatRepository;

    @GetMapping
    public ResponseEntity<List<Chat>> getUserChats(Authentication authentication) {
        String userId = authentication.getName();
        List<Chat> chats = chatRepository.findByUserId(userId);
        return ResponseEntity.ok(chats);
    }

    @PostMapping
    public ResponseEntity<Chat> saveChat(@RequestBody Chat chat, Authentication authentication) {
        chat.setUserId(authentication.getName());
        Chat saved = chatRepository.save(chat);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/dummy")
    public ResponseEntity<Chat> getDummyChat() {
        Chat chat = new Chat();
        chat.setId("dummy-id");
        chat.setUserId("dummy-user");
        Message m1 = new Message();
        m1.setSender("user");
        m1.setContent("Hello, assistant!");
        m1.setTimestamp(Instant.now().minusSeconds(120));
        Message m2 = new Message();
        m2.setSender("assistant");
        m2.setContent("Hello! How can I help you today?");
        m2.setTimestamp(Instant.now().minusSeconds(110));
        chat.setMessages(Arrays.asList(m1, m2));
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askAssistant(@RequestBody java.util.Map<String, String> body,
            Authentication authentication) {
        String userMessage = body.get("message");
        // Store chat in DB only if user is authenticated
        if (authentication != null) {
            String userId = authentication.getName();
            // Store user message as a chat FIRST
            Message userMsg = new Message();
            userMsg.setSender("user");
            userMsg.setContent(userMessage);
            Instant userTime = java.time.Instant.now();
            userMsg.setTimestamp(userTime);
            Chat userChat = new Chat();
            userChat.setUserId(userId);
            userChat.setMessages(java.util.Arrays.asList(userMsg));
            userChat.setLastUpdated(userTime);
            chatRepository.save(userChat);
        }
        // Now call Python backend and get response
        RestTemplate restTemplate = new RestTemplate();
        String pythonApiUrl = "http://localhost:5001/ask";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<java.util.Map<String, String>> entity = new HttpEntity<>(body, headers);
        java.util.Map<String, Object> response = restTemplate.exchange(
                pythonApiUrl,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<java.util.Map<String, Object>>() {
                }).getBody();
        if (response == null || !response.containsKey("answer")) {
            return ResponseEntity.status(502).body(
                    java.util.Collections.singletonMap("error", "Assistant service unavailable or returned no answer"));
        }
        if (authentication != null) {
            String userId = authentication.getName();
            Message assistantMsg = new Message();
            assistantMsg.setSender("assistant");
            assistantMsg.setContent((String) response.get("answer"));
            Instant assistantTime = java.time.Instant.now();
            assistantMsg.setTimestamp(assistantTime);
            Chat assistantChat = new Chat();
            assistantChat.setUserId(userId);
            assistantChat.setMessages(java.util.Arrays.asList(assistantMsg));
            assistantChat.setLastUpdated(assistantTime);
            chatRepository.save(assistantChat);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Chat>> getChatHistory(Authentication authentication) {
        String userId = authentication.getName();
        List<Chat> chats = chatRepository.findByUserId(userId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/history/updates")
    public ResponseEntity<List<Chat>> getChatUpdates(@RequestParam("since") double since,
            Authentication authentication) {
        String userId = authentication.getName();
        // Convert seconds (possibly with decimals) to milliseconds
        long sinceMillis = (long) (since * 1000);
        Instant sinceInstant = Instant.ofEpochMilli(sinceMillis);
        List<Chat> chats = chatRepository.findByUserIdAndLastUpdatedAfter(userId, sinceInstant);
        return ResponseEntity.ok(chats);
    }
}
