package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.PlayerAnswer;
import com.ikhsan.ProyekOprecOOP.model.Round;
import com.ikhsan.ProyekOprecOOP.repository.PlayerAnswerRepository;
import com.ikhsan.ProyekOprecOOP.repository.RoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/player-answers")
public class PlayerAnswerController {

    private final PlayerAnswerRepository playerAnswerRepository;
    private final RoundRepository roundRepository;

    @Autowired
    public PlayerAnswerController(
            PlayerAnswerRepository playerAnswerRepository,
            RoundRepository roundRepository) {
        this.playerAnswerRepository = playerAnswerRepository;
        this.roundRepository = roundRepository;
    }

    // DTO untuk PlayerAnswer
    public static class PlayerAnswerDTO {
        private UUID answerId;
        private UUID roundId;
        private UUID userId;
        private UUID songIdGuess;
        private String songGuessTitle;
        private Integer answerTimeMs;
        private Boolean isCorrect;
        private Date createdAt;

        public PlayerAnswerDTO(PlayerAnswer answer) {
            this.answerId = answer.getAnswerId();
            
            if (answer.getRound() != null) {
                this.roundId = answer.getRound().getRoundId();
            }
            
            if (answer.getUser() != null) {
                this.userId = answer.getUser().getUserId();
            }
            
            if (answer.getGuessedSong() != null) {
                this.songIdGuess = answer.getGuessedSong().getSongId();
                this.songGuessTitle = answer.getGuessedSong().getTitle();
            }
              this.answerTimeMs = answer.getAnswerTimeMs();
            this.isCorrect = answer.getCorrect();
            
            if (answer.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(answer.getCreatedAt());
            }
        }

        // Getters and setters
        public UUID getAnswerId() {
            return answerId;
        }

        public void setAnswerId(UUID answerId) {
            this.answerId = answerId;
        }

        public UUID getRoundId() {
            return roundId;
        }

        public void setRoundId(UUID roundId) {
            this.roundId = roundId;
        }

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public UUID getSongIdGuess() {
            return songIdGuess;
        }

        public void setSongIdGuess(UUID songIdGuess) {
            this.songIdGuess = songIdGuess;
        }

        public String getSongGuessTitle() {
            return songGuessTitle;
        }

        public void setSongGuessTitle(String songGuessTitle) {
            this.songGuessTitle = songGuessTitle;
        }

        public Integer getAnswerTimeMs() {
            return answerTimeMs;
        }

        public void setAnswerTimeMs(Integer answerTimeMs) {
            this.answerTimeMs = answerTimeMs;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }

    @PostMapping("/submit")
    public BaseResponse<PlayerAnswerDTO> submitAnswer(@RequestBody Map<String, Object> payload) {
        try {
            // Extract data from payload
            UUID userId = UUID.fromString((String) payload.get("userId"));
            UUID roundId = UUID.fromString((String) payload.get("roundId"));
            UUID songIdGuess = UUID.fromString((String) payload.get("songIdGuess"));
            Integer answerTimeMs = (Integer) payload.get("answerTimeMs");

            // Find the round to get the correct song ID
            Optional<Round> roundOpt = roundRepository.findById(roundId);
            if (roundOpt.isEmpty()) {
                return new BaseResponse<>(false, "Round not found", null);
            }
            Round round = roundOpt.get();
            UUID correctSongId = round.getSongIdCorrect();

            // Create a new answer
            PlayerAnswer playerAnswer = new PlayerAnswer();
            playerAnswer.setUserId(userId);
            playerAnswer.setRoundId(roundId);
            playerAnswer.setSongIdGuess(songIdGuess);
            playerAnswer.setAnswerTimeMs(answerTimeMs != null ? answerTimeMs : 0);
            playerAnswer.setIsCorrect(correctSongId.equals(songIdGuess));

            // Save the answer
            PlayerAnswer savedAnswer = playerAnswerRepository.save(playerAnswer);
            return new BaseResponse<>(true, "Answer submitted successfully", new PlayerAnswerDTO(savedAnswer));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error submitting answer: " + e.getMessage(), null);
        }
    }
    
    @GetMapping("/round/{roundId}")
    public BaseResponse<List<PlayerAnswerDTO>> getAnswersForRound(@PathVariable UUID roundId) {
        try {
            List<PlayerAnswer> answers = playerAnswerRepository.findByRound_RoundId(roundId);
            
            // Convert to DTOs
            List<PlayerAnswerDTO> answerDTOs = new ArrayList<>();
            for (PlayerAnswer answer : answers) {
                answerDTOs.add(new PlayerAnswerDTO(answer));
            }
            
            return new BaseResponse<>(true, "Answers retrieved successfully", answerDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error retrieving answers: " + e.getMessage(), null);
        }
    }
    
    @GetMapping("/user/{userId}")
    public BaseResponse<List<PlayerAnswerDTO>> getAnswersByUser(@PathVariable UUID userId) {
        try {
            List<PlayerAnswer> answers = playerAnswerRepository.findByUser_UserId(userId);
            
            // Convert to DTOs
            List<PlayerAnswerDTO> answerDTOs = new ArrayList<>();
            for (PlayerAnswer answer : answers) {
                answerDTOs.add(new PlayerAnswerDTO(answer));
            }
            
            return new BaseResponse<>(true, "User answers retrieved successfully", answerDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error retrieving user answers: " + e.getMessage(), null);
        }
    }
}
