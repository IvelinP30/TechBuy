package com.techbuy.domain.exception;

import java.io.Serial;

public class DataValidationException extends ProcessingException{
    //400
    @Serial
    private static final long serialVersionUID = 1L;

    public DataValidationException()
    {
        super();
    }

    public DataValidationException(String message)
    {
        super(message);
    }
    public DataValidationException(String message, Object value)
    {
        super(message, value);
    }
    public DataValidationException(String message, Object value, Throwable cause)
    {
        super(message, value, cause);
    }

    public DataValidationException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
