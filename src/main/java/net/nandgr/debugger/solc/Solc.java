package net.nandgr.debugger.solc;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.nandgr.debugger.solc.solcjson.SolcOutput;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

public class Solc {

    private final String fileName;

    public Solc(String fileName) {
        this.fileName = fileName;
    }

    public SolcOutput compile() throws IOException, InterruptedException {
        String json = compileSource();
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, SolcOutput.class);
    }

    private String compileSource() throws InterruptedException, IOException {
        ProcessBuilder builder = new ProcessBuilder("solc", "--pretty-json", "--combined-json","asm,bin-runtime", fileName);

        builder.inheritIO().redirectOutput(ProcessBuilder.Redirect.PIPE);
        Process p = builder.start();
        BufferedReader buf = new BufferedReader(new InputStreamReader(p.getInputStream()));
        String line;
        StringBuilder output = new StringBuilder();
        while ((line = buf.readLine()) != null) {
            output.append(line).append(System.lineSeparator());
        }

        p.waitFor(5, TimeUnit.MINUTES);
        buf.close();
        return output.toString();
    }

    public static boolean checkSolcInClasspath() {
        final String SOLC_EXEC_NAME = "solc";
        return Arrays.stream(System.getenv("PATH").split(Pattern.quote(File.pathSeparator)))
                .map(Paths::get)
                .anyMatch(path -> Files.exists(path.resolve(SOLC_EXEC_NAME)));
    }
}
