package net.nandgr.debugger.report;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Files;
import java.util.Properties;

public class Report {

    private static final String REPORT_FILE_NAME = "debug.html";
    private static final String TEMPLATE_FILE = "template/graph_template.html";

    private final String source;
    private final String trace;
    private final String graph;

    public Report(String source, String trace, String graph) {
        this.source = source;
        this.trace = trace;
        this.graph = graph;
    }

    public void createReport() throws ReportException {
        File debugFile = new File(REPORT_FILE_NAME);
        try {
            if (!debugFile.createNewFile()) {
                throw new ReportException("Report file cannot be created");
            }
        } catch (IOException e) {
            throw new ReportException("Failed creating report", e);
        }

        VelocityEngine velocityEngine = new VelocityEngine();
        Properties p = new Properties();
        p.setProperty("resource.loader", "class");
        p.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
        velocityEngine.init(p);
        Template template = velocityEngine.getTemplate(TEMPLATE_FILE);
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("trace", trace);
        velocityContext.put("graph", graph);
        velocityContext.put("source", source);
        StringWriter stringWriter = new StringWriter();
        template.merge(velocityContext, stringWriter);
        try {
            Files.write(debugFile.toPath(), stringWriter.toString().getBytes());
        } catch (IOException e) {
            throw new ReportException("Failed when writing into report file", e);
        }
    }
}
