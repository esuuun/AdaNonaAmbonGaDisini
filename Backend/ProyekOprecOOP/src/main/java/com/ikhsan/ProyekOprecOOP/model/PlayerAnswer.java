package com.ikhsan.ProyekOprecOOP.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "playeranswers")
public class PlayerAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID answerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id")
    private Round round;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id_guess")
    private Song guessedSong;

    private Integer answerTimeMs;

    private Boolean isCorrect;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public PlayerAnswer() {
    }

    // --- Getters and Setters ---

    public UUID getAnswerId() {
        return answerId;
    }

    public void setAnswerId(UUID answerId) {
        this.answerId = answerId;
    }

    public Round getRound() {
        return round;
    }

    public void setRound(Round round) {
        this.round = round;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song getGuessedSong() {
        return guessedSong;
    }

    public void setGuessedSong(Song guessedSong) {
        this.guessedSong = guessedSong;
    }

    public Integer getAnswerTimeMs() {
        return answerTimeMs;
    }

    public void setAnswerTimeMs(Integer answerTimeMs) {
        this.answerTimeMs = answerTimeMs;
    }

    public Boolean getCorrect() {
        return isCorrect;
    }

    public void setUserId(UUID userId) {
        if (this.user == null) {
            this.user = new User();
        }
        this.user.setUserId(userId);
    }

    public void setRoundId(UUID roundId) {
        if (this.round == null) {
            this.round = new Round();
        }
        this.round.setRoundId(roundId);
    }

    public void setSongIdGuess(UUID songIdGuess) {
        if (this.guessedSong == null) {
            this.guessedSong = new Song();
        }
        this.guessedSong.setSongId(songIdGuess);
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
