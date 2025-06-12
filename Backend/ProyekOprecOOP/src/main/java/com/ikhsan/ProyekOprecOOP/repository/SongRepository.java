package com.ikhsan.ProyekOprecOOP.repository;

import com.ikhsan.ProyekOprecOOP.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SongRepository extends JpaRepository<Song, UUID> {
    
    /**
     * Find songs by genre
     * @param genre the genre name or ID
     * @return List of songs in that genre
     */
    List<Song> findByGenre(String genre);
    
    /**
     * Find songs where ID is not equal to the given ID
     * @param songId the song ID to exclude
     * @return List of songs with different IDs
     */
    List<Song> findBySongIdNot(UUID songId);
    
    /**
     * Find random songs by genre
     * @param genre the genre to filter by
     * @param limit maximum number of songs to return
     * @return List of random songs
     */
    @Query(value = "SELECT * FROM songs WHERE genre = :genre ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Song> findRandomByGenre(@Param("genre") String genre, @Param("limit") int limit);
}
