package net.nandgr.debugger.asm.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public class Code {

    private int begin;
    private int end;
    private String name;
    private String value;

    public int getBegin() {
        return begin;
    }

    public void setBegin(int begin) {
        this.begin = begin;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "Code{" +
                "begin=" + begin +
                ", end=" + end +
                ", name='" + name + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
