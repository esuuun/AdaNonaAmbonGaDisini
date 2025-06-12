package com.ikhsan.ProyekOprecOOP.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rounds")
public class Round {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roundId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private GameRoom gameRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id_correct")
    private Song correctSong;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Round() {
    }

    // --- Getters and Setters ---

    public UUID getRoundId() {
        return roundId;
    }

    public void setRoundId(UUID roundId) {
        this.roundId = roundId;
    }

    public void setRoomId(UUID roomId) {
        if (gameRoom == null) {
            gameRoom = new GameRoom();
        }
        gameRoom.setRoomId(roomId);
    }

    public GameRoom getGameRoom() {
        return gameRoom;
    }

    public void setGameRoom(GameRoom gameRoom) {
        this.gameRoom = gameRoom;
    }

    public Song getCorrectSong() {
        return correctSong;
    }

    public void setCorrectSong(Song correctSong) {
        this.correctSong = correctSong;
    }

    public UUID getSongIdCorrect() {
        return correctSong != null ? correctSong.getSongId() : null;
    }

    public void setSongIdCorrect(UUID songId) {
        if (correctSong == null) {
            correctSong = new Song();
        }
        correctSong.setSongId(songId);
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