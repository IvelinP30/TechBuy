package com.techbuy.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

//    private String tokenType;
//    private Long expiresIn;
    private String refreshToken;
    private String accessToken;
    private String userName;
//    private String sessionId;
//    private String customerName;
//    private String customerId;
//    private Long createdOn;
}
