package com.techbuy.oauth;

import io.quarkus.security.credential.TokenCredential;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import org.jboss.logging.Logger;

@Path("/oauth/callback")
public class AuthCallbackResource {

    @Inject
    Logger LOG;

    @Inject
    SecurityIdentity securityIdentity;


    /*
      After successful authentication, Quarkus will automatically redirect here
      we  can do additional logic if necessary, such as logging the user or fetching additional data
      Redirect to the frontend route after successful authentication
      Set the access token as a secure HTTP cookie
     */
    @GET
    @PermitAll
    public Response handleCallback(@QueryParam("code") String code) {
        String accessToken = securityIdentity.getCredential(TokenCredential.class).getToken();
        LOG.info("accessToken " + accessToken );
        final NewCookie accessTokenCookie =  new NewCookie.Builder("accessToken").value(accessToken).path("/").build();
        return Response.seeOther(URI.create("/home"))
                .cookie(accessTokenCookie)
                .build();
    }

}
