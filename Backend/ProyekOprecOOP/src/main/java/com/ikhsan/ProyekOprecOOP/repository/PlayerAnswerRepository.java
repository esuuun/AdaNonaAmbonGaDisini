package com.ikhsan.ProyekOprecOOP.repository;

import com.ikhsan.ProyekOprecOOP.model.PlayerAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlayerAnswerRepository extends JpaRepository<PlayerAnswer, UUID> {
    
    /**
     * Find all answers for a specific round
     * @param roundId the ID of the round
     * @return List of player answers for that round
     */
    List<PlayerAnswer> findByRound_RoundId(UUID roundId);
    
    /**
     * Find all answers by a specific user
     * @param userId the ID of the user
     * @return List of answers from that user
     */
    List<PlayerAnswer> findByUser_UserId(UUID userId);
    
    /**
     * Find answers for a user in a specific round
     * @param userId the ID of the user
     * @param roundId the ID of the round
     * @return List of matching answers
     */
    List<PlayerAnswer> findByUser_UserIdAndRound_RoundId(UUID userId, UUID roundId);
    
    /**
     * Count correct answers for a user
     * @param userId the ID of the user
     * @return Count of correct answers
     */
    @Query("SELECT COUNT(pa) FROM PlayerAnswer pa WHERE pa.user.userId = ?1 AND pa.isCorrect = true")
    int countCorrectAnswersByUser(UUID userId);
}
