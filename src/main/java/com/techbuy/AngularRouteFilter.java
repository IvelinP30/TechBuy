package com.techbuy;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.util.regex.Pattern;


@WebFilter(urlPatterns = "/*")
public class AngularRouteFilter extends HttpFilter {

    private static final Pattern FILE_NAME_PATTERN = Pattern.compile(".*[.][a-zA-Z\\d]+");
    private static final String API_PREFIX = "/api/";
    private static final String OAUTH_PREFIX = "/oauth/";

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String path = request.getRequestURI().substring(request.getContextPath().length()).replaceAll("[/]+$", "");

        if (path.startsWith(API_PREFIX) || path.startsWith(OAUTH_PREFIX) ) {
            chain.doFilter(request, response); // Proceed normally for API and oauth routes
            return;
        }

        // Check if the request is for a static resource (file)
        if (!FILE_NAME_PATTERN.matcher(path).matches()) {
            // If not a file and not an API, forward to the front-end routes
            response.setStatus(HttpServletResponse.SC_OK); // Set the status to 200 OK
            request.getRequestDispatcher("/").forward(request, response);
            return;
        }

        // If it's a normal request (file or other), proceed with the chain
        chain.doFilter(request, response);
    }
}

