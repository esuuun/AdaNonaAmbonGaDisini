package com.ikhsan.ProyekOprecOOP.repository;

import com.ikhsan.ProyekOprecOOP.model.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GameRoomRepository extends JpaRepository<GameRoom, UUID> {
    /**
     * Find a game room by its room code
     * @param roomCode the unique room code
     * @return Optional GameRoom if found
     */
    Optional<GameRoom> findByRoomCode(String roomCode);
}
