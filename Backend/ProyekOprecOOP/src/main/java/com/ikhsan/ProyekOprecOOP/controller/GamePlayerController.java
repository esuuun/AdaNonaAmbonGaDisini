package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.GamePlayer;
import com.ikhsan.ProyekOprecOOP.repository.GamePlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/game-players")
public class GamePlayerController {

    private final GamePlayerRepository gamePlayerRepository;

    @Autowired
    public GamePlayerController(GamePlayerRepository gamePlayerRepository) {
        this.gamePlayerRepository = gamePlayerRepository;
    }
    
    // DTO untuk GamePlayer
    public static class GamePlayerDTO {
        private UUID gameplayerId;
        private UUID userId;
        private String username;
        private UUID roomId;
        private String roomCode;
        private Integer score;
        private Date createdAt;
        private Date updatedAt;

        public GamePlayerDTO(GamePlayer gamePlayer) {
            this.gameplayerId = gamePlayer.getGameplayerId();
            this.score = gamePlayer.getScore();
              if (gamePlayer.getUser() != null) {
                this.userId = gamePlayer.getUser().getUserId();
                this.username = gamePlayer.getUser().getName();
            }
            
            if (gamePlayer.getGameRoom() != null) {
                this.roomId = gamePlayer.getGameRoom().getRoomId();
                this.roomCode = gamePlayer.getGameRoom().getRoomCode();
            }
            
            if (gamePlayer.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(gamePlayer.getCreatedAt());
            }
            
            if (gamePlayer.getUpdatedAt() != null) {
                this.updatedAt = Timestamp.valueOf(gamePlayer.getUpdatedAt());
            }
        }

        // Getters and setters
        public UUID getGameplayerId() {
            return gameplayerId;
        }

        public void setGameplayerId(UUID gameplayerId) {
            this.gameplayerId = gameplayerId;
        }

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public UUID getRoomId() {
            return roomId;
        }

        public void setRoomId(UUID roomId) {
            this.roomId = roomId;
        }

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        public Date getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
    
    @PostMapping("/add")
    public BaseResponse<GamePlayerDTO> addPlayerToRoom(@RequestBody Map<String, String> payload) {
        UUID roomId = UUID.fromString(payload.get("roomId"));
        UUID userId = UUID.fromString(payload.get("userId"));

        // Check if player is already in the room
        Optional<GamePlayer> existingPlayer = gamePlayerRepository.findByUser_UserIdAndGameRoom_RoomId(userId, roomId);
        if (existingPlayer.isPresent()) {
            return new BaseResponse<>(true, "Player already in room", new GamePlayerDTO(existingPlayer.get()));
        }

        // Create new player entry
        GamePlayer newPlayer = new GamePlayer();
        newPlayer.setRoomId(roomId);
        newPlayer.setUserId(userId);
        newPlayer.setScore(0);

        GamePlayer savedPlayer = gamePlayerRepository.save(newPlayer);
        return new BaseResponse<>(true, "Player added to room successfully", new GamePlayerDTO(savedPlayer));
    }
    
    @GetMapping("/room/{roomId}")
    public BaseResponse<List<GamePlayerDTO>> getPlayersByRoom(@PathVariable UUID roomId) {
        List<GamePlayer> players = gamePlayerRepository.findByGameRoom_RoomId(roomId);
        
        // Convert to DTOs
        List<GamePlayerDTO> playerDTOs = new ArrayList<>();
        for (GamePlayer player : players) {
            playerDTOs.add(new GamePlayerDTO(player));
        }
        
        return new BaseResponse<>(true, "Players retrieved successfully", playerDTOs);
    }
    
    @PatchMapping("/{gamePlayerId}/score")
    public BaseResponse<GamePlayerDTO> updatePlayerScore(
            @PathVariable UUID gamePlayerId,
            @RequestBody Map<String, Integer> payload) {
        Integer scoreToAdd = payload.get("scoreToAdd");
        if (scoreToAdd == null) {
            return new BaseResponse<>(false, "Score to add is required", null);
        }

        Optional<GamePlayer> playerOptional = gamePlayerRepository.findById(gamePlayerId);
        if (playerOptional.isEmpty()) {
            return new BaseResponse<>(false, "Player not found", null);
        }

        GamePlayer player = playerOptional.get();
        player.setScore(player.getScore() + scoreToAdd);

        GamePlayer updatedPlayer = gamePlayerRepository.save(player);
        return new BaseResponse<>(true, "Player score updated successfully", new GamePlayerDTO(updatedPlayer));
    }
    
    @GetMapping("/leaderboard/{roomId}")
    public BaseResponse<List<GamePlayerDTO>> getLeaderboard(@PathVariable UUID roomId) {
        List<GamePlayer> topPlayers = gamePlayerRepository.findTopPlayersByScore(roomId, 10);
        
        // Convert to DTOs
        List<GamePlayerDTO> playerDTOs = new ArrayList<>();
        for (GamePlayer player : topPlayers) {
            playerDTOs.add(new GamePlayerDTO(player));
        }
        
        return new BaseResponse<>(true, "Leaderboard retrieved successfully", playerDTOs);
    }
}
