package net.nandgr.debugger.report;

import net.nandgr.debugger.cfg.ContractObject;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Files;
import java.security.SecureRandom;
import java.util.List;
import java.util.Properties;

public class Report {

    private static final String TEMPLATE_FILE = "template/graph_template.html";
    private static final String CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static SecureRandom random = new SecureRandom();

    private List<ContractObject> contracts;
    private final String txHash;

    public Report(List<ContractObject> contracts, String txHash) {
        this.contracts = contracts;
        this.txHash = txHash;
    }

    public String createReport() throws ReportException {
        String reportFileName = "debug-" + randomSuffix(6) + ".html";
        File debugFile = new File(reportFileName);
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
        velocityContext.put("contracts", contracts);
        velocityContext.put("txHash", txHash);
        StringWriter stringWriter = new StringWriter();
        template.merge(velocityContext, stringWriter);
        try {
            Files.write(debugFile.toPath(), stringWriter.toString().getBytes());
        } catch (IOException e) {
            throw new ReportException("Failed when writing into report file", e);
        }
        return reportFileName;
    }

    private static String randomSuffix(int len) {
        StringBuilder sb = new StringBuilder( len );
        for( int i = 0; i < len; i++ )
            sb.append( CHARS.charAt( random.nextInt(CHARS.length()) ) );
        return sb.toString();
    }
}
