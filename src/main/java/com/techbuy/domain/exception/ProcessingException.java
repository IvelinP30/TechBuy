package com.techbuy.domain.exception;

import java.io.Serial;
import java.util.Objects;

public class ProcessingException extends RuntimeException {
    //500
    
    @Serial
    private static final long serialVersionUID = 1L;

    private Object value;

    public ProcessingException() {
        super();
    }

    public ProcessingException(String message) {
        super(message);
    }

    public ProcessingException(String message, Object value) {
        super(message);
        this.value = value;
    }

    public ProcessingException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProcessingException(Throwable cause) {
        super(cause);
    }

    public ProcessingException(String message, Object value, Throwable cause) {
        super(message, cause);
        this.value = value;
    }

    public String getValue() {
        return Objects.toString(value, null);
    }

}
