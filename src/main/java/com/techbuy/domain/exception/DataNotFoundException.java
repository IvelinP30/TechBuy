package com.techbuy.domain.exception;

import java.io.Serial;

public class DataNotFoundException extends ProcessingException{
    //404
    @Serial
    private static final long serialVersionUID = 1L;

    public DataNotFoundException()
    {
        super();
    }

    public DataNotFoundException(String message)
    {
        super(message);
    }

    public DataNotFoundException(String message, String value)
    {
        super(message, value);
    }

    public DataNotFoundException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
