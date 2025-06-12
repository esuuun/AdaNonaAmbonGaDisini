package com.ikhsan.ProyekOprecOOP.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gameplayers")
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID gameplayerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private GameRoom gameRoom;

    private Integer score;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public GamePlayer() {
    }

    // --- Getters and Setters ---

    public UUID getGameplayerId() {
        return gameplayerId;
    }

    public void setGameplayerId(UUID gameplayerId) {
        this.gameplayerId = gameplayerId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public GameRoom getGameRoom() {
        return gameRoom;
    }

    public void setGameRoom(GameRoom gameRoom) {
        this.gameRoom = gameRoom;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setUserId(UUID userId) {
        if (this.user == null) {
            this.user = new User();
        }
        this.user.setUserId(userId);
    }

    public void setRoomId(UUID roomId) {
        if (this.gameRoom == null) {
            this.gameRoom = new GameRoom();
        }
        this.gameRoom.setRoomId(roomId);
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