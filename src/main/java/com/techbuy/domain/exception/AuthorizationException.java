package com.techbuy.domain.exception;

import java.io.Serial;

public class AuthorizationException extends ProcessingException{
    //403
    @Serial
    private static final long serialVersionUID = 1L;

    public AuthorizationException()
    {
        super();
    }

    public AuthorizationException(String message)
    {
        super(message);
    }

    public AuthorizationException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
