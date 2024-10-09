package com.techbuy.oauth;


import com.techbuy.domain.AuthResponse;
import com.techbuy.domain.exception.AuthenticationException;
import io.quarkus.oidc.OidcSession;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.auth.principal.DefaultJWTCallerPrincipal;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestResponse;

@Path("/api/oauth2")
@RolesAllowed("**")
public class Oauth2Endpoint {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    OidcSession oidcSession;

    @GET
    @Path("/token")
    @Produces(MediaType.APPLICATION_JSON)
    public RestResponse<AuthResponse> login(@CookieParam("accessToken") String accessToken) {
        // Check if accessToken is present in the cookie
        if (accessToken != null && !accessToken.isEmpty()) {
            DefaultJWTCallerPrincipal principal = (DefaultJWTCallerPrincipal) securityIdentity.getPrincipal();
            String name = (String) principal.getClaim("name");
            AuthResponse authResponse = AuthResponse.builder().accessToken(accessToken).userName(formatName(name)).build();
            return RestResponse.ResponseBuilder.ok(authResponse).build();
        } else if (oidcSession != null && oidcSession.getIdToken() != null) {
            DefaultJWTCallerPrincipal principal = (DefaultJWTCallerPrincipal) securityIdentity.getPrincipal();
            String name = (String) principal.getClaim("name");
            AuthResponse authResponse = AuthResponse.builder().accessToken(principal.getRawToken()).userName(formatName(name)).build();
            return RestResponse.ResponseBuilder.ok(authResponse).build();
        } else {
            // Handle the case where the access token isn't present
            throw new AuthenticationException("Error while getting token info...");
        }
    }

    public static String formatName(String input) {
        if(input == null || input.isBlank()) return input;
        int commaIndex = input.lastIndexOf(",");
        if (commaIndex != -1) {
            String substring = input.substring(commaIndex + 1).trim();
            return !substring.isEmpty() ? substring : input;
        } else {
            return input;
        }
    }

}
