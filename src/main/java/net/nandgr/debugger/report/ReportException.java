package net.nandgr.debugger.report;

public class ReportException extends Exception {

    public ReportException(String message) {
        super(message);
    }

    public ReportException(String message, Throwable cause) {
        super(message, cause);
    }
}
