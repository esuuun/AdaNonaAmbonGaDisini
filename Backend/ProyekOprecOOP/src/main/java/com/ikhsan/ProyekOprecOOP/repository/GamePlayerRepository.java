package com.ikhsan.ProyekOprecOOP.repository;

import com.ikhsan.ProyekOprecOOP.model.GamePlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GamePlayerRepository extends JpaRepository<GamePlayer, UUID> {
    
    /**
     * Find all players in a game room
     * @param roomId the ID of the game room
     * @return List of players in that room
     */
    List<GamePlayer> findByGameRoom_RoomId(UUID roomId);

    /**
     * Find a player entry for a specific user in a specific room
     * @param userId the ID of the user
     * @param roomId the ID of the room
     * @return Optional GamePlayer if found
     */
    Optional<GamePlayer> findByUser_UserIdAndGameRoom_RoomId(UUID userId, UUID roomId);

    /**
     * Find all game player entries for a user
     * @param userId the ID of the user
     * @return List of GamePlayer entries
     */
    List<GamePlayer> findByUser_UserId(UUID userId);

    /**
     * Get highest scoring players in a room
     * @param roomId the ID of the game room
     * @param limit maximum number of players to return
     * @return List of GamePlayer entries ordered by score
     */
    @Query("SELECT gp FROM GamePlayer gp WHERE gp.gameRoom.roomId = ?1 ORDER BY gp.score DESC LIMIT ?2")
    List<GamePlayer> findTopPlayersByScore(UUID roomId, int limit);
}


