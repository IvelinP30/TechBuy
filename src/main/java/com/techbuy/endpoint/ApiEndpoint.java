package com.techbuy.endpoint;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Path("/api/devices")
public class ApiEndpoint {

    @Inject
    Logger LOG;

    private static final String JSON_FILE_PATH = "devices.json";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDevices() {
        LOG.info("getDevices called");

        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(JSON_FILE_PATH)) {
            if (inputStream == null) {
                LOG.error("JSON file not found: " + JSON_FILE_PATH);
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\": \"JSON file not found\"}")
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            }

            String jsonContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            return Response.ok(jsonContent, MediaType.APPLICATION_JSON).build();
        } catch (IOException e) {
            LOG.error("Error reading JSON file", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error reading JSON file\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }
}
