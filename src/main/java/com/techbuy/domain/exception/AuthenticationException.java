package com.techbuy.domain.exception;

import java.io.Serial;

public class AuthenticationException extends ProcessingException{
//401
@Serial
private static final long serialVersionUID = 1L;

    public AuthenticationException()
    {
        super();
    }

    public AuthenticationException(String message)
    {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public AuthenticationException(String message, Object value)
    {
        super(message, value);
    }
}
