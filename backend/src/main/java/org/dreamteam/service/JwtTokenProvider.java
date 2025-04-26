package org.dreamteam.service;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.logging.Logger;

@Service
public class JwtTokenProvider {

    private static final Logger logger = Logger.getLogger(JwtTokenProvider.class.getName());

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes()) // Use byte[] for the secret
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret.getBytes()) // Use byte[] for the secret
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret.getBytes()).parseClaimsJws(authToken); // Use byte[] for the secret
            return true;
        } catch (ExpiredJwtException e) {
            logger.warning("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warning("JWT token is unsupported: " + e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warning("JWT token is malformed: " + e.getMessage());
        } catch (SignatureException e) {
            logger.warning("JWT signature validation failed: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warning("JWT token is invalid: " + e.getMessage());
        }
        return false;
    }
}
