package org.dreamteam.controller;

import org.dreamteam.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor; 

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor 
public class PaymentController {

    private final StripeService stripeService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody CreateCheckoutSessionRequest request,
                                                   Authentication authentication) {
        String userEmail = authentication.getName();

        try {
            String url = stripeService.createCheckoutSession(request.getPriceId());
            return ResponseEntity.ok(new CreateCheckoutSessionResponse(url));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error creating Stripe session: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    public static class CreateCheckoutSessionRequest {
         private String priceId;
    
         public String getPriceId() {
             return priceId;
         }
    
         public void setPriceId(String priceId) {
             this.priceId = priceId;
         }
     }
    
     public static class CreateCheckoutSessionResponse {
         private String url;
    
         public CreateCheckoutSessionResponse(String url) {
             this.url = url;
         }
    
         public String getUrl() {
             return url;
         }
    
         public void setUrl(String url) {
             this.url = url;
         }
     }
}