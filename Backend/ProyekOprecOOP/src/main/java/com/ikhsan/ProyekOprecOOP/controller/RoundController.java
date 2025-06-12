package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.GameRoom;
import com.ikhsan.ProyekOprecOOP.model.Round;
import com.ikhsan.ProyekOprecOOP.model.Song;
import com.ikhsan.ProyekOprecOOP.repository.GameRoomRepository;
import com.ikhsan.ProyekOprecOOP.repository.RoundRepository;
import com.ikhsan.ProyekOprecOOP.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.sql.Timestamp;

@CrossOrigin
@RestController
@RequestMapping("/rounds")
public class RoundController {

    private final RoundRepository roundRepository;
    private final GameRoomRepository gameRoomRepository;
    private final SongRepository songRepository;

    @Autowired
    public RoundController(
            RoundRepository roundRepository,
            GameRoomRepository gameRoomRepository,
            SongRepository songRepository) {
        this.roundRepository = roundRepository;
        this.gameRoomRepository = gameRoomRepository;
        this.songRepository = songRepository;
    }

    // Simple DTO to avoid serialization issues with lazy-loaded entities
    public static class RoundDTO {
        private UUID roundId;
        private UUID roomId;
        private String roomCode;
        private UUID correctSongId;
        private String correctSongTitle;
        private Date createdAt;

        public RoundDTO(Round round) {
            this.roundId = round.getRoundId();
            
            if (round.getGameRoom() != null) {
                this.roomId = round.getGameRoom().getRoomId();
                this.roomCode = round.getGameRoom().getRoomCode();
            }
            
            if (round.getCorrectSong() != null) {
                this.correctSongId = round.getCorrectSong().getSongId();
                this.correctSongTitle = round.getCorrectSong().getTitle();
            }            
            // Convert LocalDateTime to Date if needed
            if (round.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(round.getCreatedAt());
            }
        }

        // Getters and setters
        public UUID getRoundId() {
            return roundId;
        }

        public void setRoundId(UUID roundId) {
            this.roundId = roundId;
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

        public UUID getCorrectSongId() {
            return correctSongId;
        }

        public void setCorrectSongId(UUID correctSongId) {
            this.correctSongId = correctSongId;
        }

        public String getCorrectSongTitle() {
            return correctSongTitle;
        }

        public void setCorrectSongTitle(String correctSongTitle) {
            this.correctSongTitle = correctSongTitle;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }

    @GetMapping("/room/{roomId}")
    public BaseResponse<List<RoundDTO>> getRoundsByRoomId(@PathVariable UUID roomId) {
        // Use the query method that properly fetches related entities
        List<Round> rounds = roundRepository.findByRoomIdWithRelationships(roomId);
        
        // Convert to DTOs to avoid serialization issues
        List<RoundDTO> roundDTOs = new ArrayList<>();
        for (Round round : rounds) {
            roundDTOs.add(new RoundDTO(round));
        }
        
        return new BaseResponse<>(true, "Rounds retrieved successfully", roundDTOs);
    }
    
    @PostMapping("/create-for-room/{roomId}")
    public BaseResponse<?> createRoundsForRoom(
            @PathVariable UUID roomId,
            @RequestBody Map<String, Integer> payload) {

        // Check if the room exists
        Optional<GameRoom> roomOptional = gameRoomRepository.findById(roomId);
        if (roomOptional.isEmpty()) {
            return new BaseResponse<>(false, "Game room not found", null);
        }

        GameRoom gameRoom = roomOptional.get();
        String gameMode = gameRoom.getGameMode();

        // Get count from request body
        int count = payload.getOrDefault("count", 5);

        // Find the genre from the gameMode or from gameRoom additional properties
        String genre = gameMode; // Assuming gameMode is the genre for simplicity

        // Get random songs for this genre
        List<Song> randomSongs = songRepository.findRandomByGenre(genre, count);

        if (randomSongs.isEmpty()) {
            return new BaseResponse<>(false, "No songs available for genre: " + genre, null);
        }

        try {
            List<Round> createdRounds = new ArrayList<>();
            // Create a round for each song
            for (Song song : randomSongs) {
                Round round = new Round();
                // Set the full entities first - this is important for proper JPA relationship mapping
                round.setGameRoom(gameRoom);
                round.setCorrectSong(song);

                Round savedRound = roundRepository.save(round);
                createdRounds.add(savedRound);
            }
            
            // Convert to DTOs to avoid serialization issues
            List<RoundDTO> roundDTOs = new ArrayList<>();
            for (Round round : createdRounds) {
                roundDTOs.add(new RoundDTO(round));
            }
            
            return new BaseResponse<>(true, "Rounds created successfully", roundDTOs);
        } catch (Exception e) {
            // Add error logging
            e.printStackTrace();
            return new BaseResponse<>(false, "Failed to create rounds: " + e.getMessage(), null);
        }
    }
}

