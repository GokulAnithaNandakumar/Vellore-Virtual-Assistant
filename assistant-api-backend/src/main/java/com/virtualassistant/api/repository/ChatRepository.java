package com.virtualassistant.api.repository;

import com.virtualassistant.api.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByUserId(String userId);

    List<Chat> findByUserIdAndLastUpdatedAfter(String userId, java.time.Instant lastUpdated);
}
