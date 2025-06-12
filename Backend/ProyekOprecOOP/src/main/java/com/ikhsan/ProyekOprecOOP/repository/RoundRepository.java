package com.ikhsan.ProyekOprecOOP.repository;

import com.ikhsan.ProyekOprecOOP.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoundRepository extends JpaRepository<Round, UUID> {
    
    /**
     * Find all rounds for a specific game room
     * @param roomId the ID of the game room
     * @return List of rounds for that room
     */
    List<Round> findByGameRoom_RoomId(UUID roomId);
    
    /**
     * Find rounds ordered by creation date
     * @param roomId the ID of the game room
     * @return List of rounds ordered chronologically
     */
    List<Round> findByGameRoom_RoomIdOrderByCreatedAtAsc(UUID roomId);
    
    /**
     * Find rounds with eager loading of related entities
     * @param roomId the ID of the game room
     * @return List of rounds with loaded relationships
     */
    @Query("SELECT r FROM Round r LEFT JOIN FETCH r.gameRoom LEFT JOIN FETCH r.correctSong WHERE r.gameRoom.roomId = :roomId ORDER BY r.createdAt ASC")
    List<Round> findByRoomIdWithRelationships(@Param("roomId") UUID roomId);
}
