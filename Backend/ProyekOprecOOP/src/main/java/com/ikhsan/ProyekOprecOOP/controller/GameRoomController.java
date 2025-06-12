package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.GameRoom;
import com.ikhsan.ProyekOprecOOP.repository.GameRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/gamerooms")
public class GameRoomController {

    private final GameRoomRepository gameRoomRepository;

    @Autowired
    public GameRoomController(GameRoomRepository gameRoomRepository) {
        this.gameRoomRepository = gameRoomRepository;
    }

    // DTO untuk GameRoom
    public static class GameRoomDTO {
        private UUID roomId;
        private String roomCode;
        private String gameMode;
        private String status;
        private Date createdAt;
        private Date updatedAt;

        public GameRoomDTO(GameRoom gameRoom) {
            this.roomId = gameRoom.getRoomId();
            this.roomCode = gameRoom.getRoomCode();
            this.gameMode = gameRoom.getGameMode();
            this.status = gameRoom.getStatus();
            
            if (gameRoom.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(gameRoom.getCreatedAt());
            }
            
            if (gameRoom.getUpdatedAt() != null) {
                this.updatedAt = Timestamp.valueOf(gameRoom.getUpdatedAt());
            }
        }

        // Getters and setters
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

        public String getGameMode() {
            return gameMode;
        }

        public void setGameMode(String gameMode) {
            this.gameMode = gameMode;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
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

    private String generateUniqueRoomCode() {
        String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        String code;
        do {
            StringBuilder sb = new StringBuilder(4);
            for (int i = 0; i < 4; i++) {
                sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
            }
            code = sb.toString();
        } while (gameRoomRepository.findByRoomCode(code).isPresent());
        return code;
    }

    @GetMapping("/{roomId}")
    public BaseResponse<GameRoomDTO> getGameRoomById(@PathVariable UUID roomId) {
        Optional<GameRoom> roomOptional = gameRoomRepository.findById(roomId);
        if (roomOptional.isEmpty()) {
            return new BaseResponse<>(false, "Game room not found", null);
        }
        return new BaseResponse<>(true, "Game room retrieved successfully", new GameRoomDTO(roomOptional.get()));
    }
    
    @GetMapping("/code/{roomCode}")
    public BaseResponse<GameRoomDTO> getGameRoomByCode(@PathVariable String roomCode) {
        Optional<GameRoom> roomOptional = gameRoomRepository.findByRoomCode(roomCode);
        if (roomOptional.isEmpty()) {
            return new BaseResponse<>(false, "Game room not found", null);
        }
        return new BaseResponse<>(true, "Game room retrieved successfully", new GameRoomDTO(roomOptional.get()));
    }

    @PostMapping("/create")
    public BaseResponse<GameRoomDTO> createGameRoom(@RequestBody Map<String, String> payload) {
        GameRoom newRoom = new GameRoom();
        
        newRoom.setGameMode(payload.getOrDefault("gameMode", "default"));
        newRoom.setStatus("waiting");
        newRoom.setRoomCode(generateUniqueRoomCode());

        GameRoom savedRoom = gameRoomRepository.save(newRoom);
        return new BaseResponse<>(true, "Game room created successfully", new GameRoomDTO(savedRoom));
    }
}
