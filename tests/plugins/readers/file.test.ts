import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { FileReader } from "../../../src/plugins/readers/file";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("FileReader", () => {
  let filePath: string;
  let reader: FileReader;

  beforeEach(() => {
    filePath = join(tmpdir(), `brain-stash-ctx-${Date.now()}`);
    reader = new FileReader(filePath);
  });

  afterEach(() => {
    if (existsSync(filePath)) unlinkSync(filePath);
  });

  it("reads context from file", async () => {
    writeFileSync(filePath, "bloque");
    expect(await reader.getCurrentContext()).toBe("bloque");
  });

  it("returns 'personal' if the file does not exist", async () => {
    expect(await reader.getCurrentContext()).toBe("personal");
  });

  it("trims surrounding whitespace and newlines", async () => {
    writeFileSync(filePath, "  u  \n");
    expect(await reader.getCurrentContext()).toBe("u");
  });

  it("reads all three valid context keys", async () => {
    for (const ctx of ["personal", "u", "bloque"]) {
      writeFileSync(filePath, ctx);
      expect(await reader.getCurrentContext()).toBe(ctx);
    }
  });
});
