package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.Artist;
import com.ikhsan.ProyekOprecOOP.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/artists")
public class ArtistController {
    
    private final ArtistRepository artistRepository;
    
    @Autowired
    public ArtistController(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }
    
    // DTO untuk Artist
    public static class ArtistDTO {
        private UUID artistId;
        private String name;
        private String apiArtistId;
        private Date createdAt;
        private Date updatedAt;
        
        public ArtistDTO(Artist artist) {
            this.artistId = artist.getArtistId();
            this.name = artist.getName();
            this.apiArtistId = artist.getApiArtistId();
            
            if (artist.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(artist.getCreatedAt());
            }
            
            if (artist.getUpdatedAt() != null) {
                this.updatedAt = Timestamp.valueOf(artist.getUpdatedAt());
            }
        }
        
        // Getters and setters
        public UUID getArtistId() {
            return artistId;
        }

        public void setArtistId(UUID artistId) {
            this.artistId = artistId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getApiArtistId() {
            return apiArtistId;
        }

        public void setApiArtistId(String apiArtistId) {
            this.apiArtistId = apiArtistId;
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
    
    @GetMapping("/all")
    public BaseResponse<List<ArtistDTO>> getAllArtists() {
        List<Artist> artists = artistRepository.findAll();
        
        // Convert to DTOs
        List<ArtistDTO> artistDTOs = new ArrayList<>();
        for (Artist artist : artists) {
            artistDTOs.add(new ArtistDTO(artist));
        }
        
        return new BaseResponse<>(true, "Artists retrieved successfully", artistDTOs);
    }
    
    @GetMapping("/{artistId}")
    public BaseResponse<ArtistDTO> getArtistById(@PathVariable UUID artistId) {
        Optional<Artist> artistOptional = artistRepository.findById(artistId);
        if (artistOptional.isEmpty()) {
            return new BaseResponse<>(false, "Artist not found", null);
        }
        return new BaseResponse<>(true, "Artist retrieved successfully", new ArtistDTO(artistOptional.get()));
    }
    
    @PostMapping("/create")
    public BaseResponse<ArtistDTO> createArtist(@RequestBody Artist artist) {
        try {
            Artist savedArtist = artistRepository.save(artist);
            return new BaseResponse<>(true, "Artist created successfully", new ArtistDTO(savedArtist));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error creating artist: " + e.getMessage(), null);
        }
    }
    
    @PutMapping("/{artistId}")
    public BaseResponse<ArtistDTO> updateArtist(@PathVariable UUID artistId, @RequestBody Artist artistDetails) {
        Optional<Artist> artistOptional = artistRepository.findById(artistId);
        if (artistOptional.isEmpty()) {
            return new BaseResponse<>(false, "Artist not found", null);
        }
        
        Artist existingArtist = artistOptional.get();
        existingArtist.setName(artistDetails.getName());
        existingArtist.setApiArtistId(artistDetails.getApiArtistId());
        
        try {
            Artist updatedArtist = artistRepository.save(existingArtist);
            return new BaseResponse<>(true, "Artist updated successfully", new ArtistDTO(updatedArtist));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error updating artist: " + e.getMessage(), null);
        }
    }
    
    @DeleteMapping("/{artistId}")
    public BaseResponse<Void> deleteArtist(@PathVariable UUID artistId) {
        if (!artistRepository.existsById(artistId)) {
            return new BaseResponse<>(false, "Artist not found", null);
        }
        
        try {
            artistRepository.deleteById(artistId);
            return new BaseResponse<>(true, "Artist deleted successfully", null);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, "Error deleting artist: " + e.getMessage(), null);
        }
    }
}
