package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.Song;
import com.ikhsan.ProyekOprecOOP.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/songs")
public class SongController {

    private final SongRepository songRepository;

    @Autowired
    public SongController(SongRepository songRepository) {
        this.songRepository = songRepository;
    }
    
    // DTO untuk Song
    public static class SongDTO {
        private UUID songId;
        private String title;
        private String genre;
        private UUID artistId;
        private String artistName;
        private String previewUrl;
        private String albumArtUrl;
        private String apiSongId;
        private Date createdAt;
        
        public SongDTO(Song song) {
            this.songId = song.getSongId();
            this.title = song.getTitle();
            this.genre = song.getGenre();
            this.previewUrl = song.getPreviewUrl();
            this.albumArtUrl = song.getAlbumArtUrl();
            this.apiSongId = song.getApiSongId();
            
            if (song.getArtist() != null) {
                this.artistId = song.getArtist().getArtistId();
                this.artistName = song.getArtist().getName();
            }
            
            if (song.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(song.getCreatedAt());
            }
        }
        
        // Getters and setters
        public UUID getSongId() {
            return songId;
        }

        public void setSongId(UUID songId) {
            this.songId = songId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public UUID getArtistId() {
            return artistId;
        }

        public void setArtistId(UUID artistId) {
            this.artistId = artistId;
        }

        public String getArtistName() {
            return artistName;
        }

        public void setArtistName(String artistName) {
            this.artistName = artistName;
        }

        public String getPreviewUrl() {
            return previewUrl;
        }

        public void setPreviewUrl(String previewUrl) {
            this.previewUrl = previewUrl;
        }

        public String getAlbumArtUrl() {
            return albumArtUrl;
        }

        public void setAlbumArtUrl(String albumArtUrl) {
            this.albumArtUrl = albumArtUrl;
        }

        public String getApiSongId() {
            return apiSongId;
        }

        public void setApiSongId(String apiSongId) {
            this.apiSongId = apiSongId;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }
    
    @GetMapping("/random")
    public BaseResponse<List<SongDTO>> getRandomSongsByGenre(
            @RequestParam String genre,
            @RequestParam(defaultValue = "5") int count) {
        
        // Use the optimized query to get random songs of the specified genre
        try {
            List<Song> randomSongs = songRepository.findRandomByGenre(genre, count);
            
            if (randomSongs.isEmpty()) {
                return new BaseResponse<>(true, "No songs found for this genre", Collections.emptyList());
            }
            
            // Convert to DTOs
            List<SongDTO> songDTOs = new ArrayList<>();
            for (Song song : randomSongs) {
                songDTOs.add(new SongDTO(song));
            }
            
            return new BaseResponse<>(true, "Random songs retrieved successfully", songDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error retrieving random songs: " + e.getMessage(), null);
        }
    }
    
    @GetMapping("/{songId}")
    public BaseResponse<SongDTO> getSongById(@PathVariable UUID songId) {
        Optional<Song> songOptional = songRepository.findById(songId);
        
        if (songOptional.isEmpty()) {
            return new BaseResponse<>(false, "Song not found", null);
        }
        
        Song song = songOptional.get();
        return new BaseResponse<>(true, "Song retrieved successfully", new SongDTO(song));
    }

    @GetMapping("/{songId}/options")
    public BaseResponse<Map<String, Object>> getSongOptions(@PathVariable UUID songId) {
        Optional<Song> songOptional = songRepository.findById(songId);
        
        if (songOptional.isEmpty()) {
            return new BaseResponse<>(false, "Song not found", null);
        }
        
        Song correctSong = songOptional.get();
        
        // Get other songs to use as distractors (different from the correct song)
        List<Song> allOtherSongs = songRepository.findBySongIdNot(songId);
        Collections.shuffle(allOtherSongs);
        
        // Create a list with the correct song and 3 distractors
        List<Map<String, Object>> options = new ArrayList<>();
        
        // Add the correct song
        Map<String, Object> correctOption = new HashMap<>();
        correctOption.put("songId", correctSong.getSongId());
        correctOption.put("title", correctSong.getTitle());
        
        options.add(correctOption);
        
        // Add distractors (up to 3)
        int distactorsToAdd = Math.min(3, allOtherSongs.size());
        for (int i = 0; i < distactorsToAdd; i++) {
            Song distractor = allOtherSongs.get(i);
            Map<String, Object> distractorOption = new HashMap<>();
            distractorOption.put("songId", distractor.getSongId());
            distractorOption.put("title", distractor.getTitle());
            options.add(distractorOption);
        }
        
        // Shuffle the options
        Collections.shuffle(options);
        
        // Find the index of the correct answer after shuffling
        int correctIndex = -1;
        for (int i = 0; i < options.size(); i++) {
            if (options.get(i).get("songId").equals(correctSong.getSongId())) {
                correctIndex = i;
                break;
            }
        }
        
        // Prepare the response
        Map<String, Object> response = new HashMap<>();
        response.put("options", options);
        response.put("correctIndex", correctIndex);
        
        return new BaseResponse<>(true, "Song options retrieved successfully", response);
    }
    
    // Add test songs for development
    @PostMapping("/create-test-songs")
    public BaseResponse<List<SongDTO>> createTestSongs() {
        try {
            List<Song> createdSongs = new ArrayList<>();
            
            // Create pop songs
            Song popSong1 = new Song();
            popSong1.setTitle("Lagu Pop Satu");
            popSong1.setGenre("pop");
            popSong1.setPreviewUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
            popSong1.setAlbumArtUrl("https://via.placeholder.com/150?text=Pop+Song+1");
            
            Song popSong2 = new Song();
            popSong2.setTitle("Lagu Pop Dua");
            popSong2.setGenre("pop");
            popSong2.setPreviewUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");
            popSong2.setAlbumArtUrl("https://via.placeholder.com/150?text=Pop+Song+2");
            
            // Create rock songs
            Song rockSong1 = new Song();
            rockSong1.setTitle("Lagu Rock Keren");
            rockSong1.setGenre("rock");
            rockSong1.setPreviewUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
            rockSong1.setAlbumArtUrl("https://via.placeholder.com/150?text=Rock+Song+1");
            
            // Create dangdut songs
            Song dangdutSong1 = new Song();
            dangdutSong1.setTitle("Goyang Asik");
            dangdutSong1.setGenre("dangdut");
            dangdutSong1.setPreviewUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");
            dangdutSong1.setAlbumArtUrl("https://via.placeholder.com/150?text=Dangdut+Song+1");
            
            // Save all songs and collect them
            createdSongs.add(songRepository.save(popSong1));
            createdSongs.add(songRepository.save(popSong2));
            createdSongs.add(songRepository.save(rockSong1));
            createdSongs.add(songRepository.save(dangdutSong1));
            
            // Convert to DTOs
            List<SongDTO> songDTOs = new ArrayList<>();
            for (Song song : createdSongs) {
                songDTOs.add(new SongDTO(song));
            }
            
            return new BaseResponse<>(true, "Test songs created successfully", songDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error creating test songs: " + e.getMessage(), null);
        }
    }
}
