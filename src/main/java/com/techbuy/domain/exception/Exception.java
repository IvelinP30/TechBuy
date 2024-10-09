package com.techbuy.domain.exception;


public class Exception {
    private String id;
    private ExceptionType type;
    private long time;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ExceptionType getType() {
        return type;
    }

    public void setType(ExceptionType type) {
        this.type = type;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "Exception{" +
                "id='" + id + '\'' +
                ", type=" + type +
                ", time=" + time +
                '}';
    }


}