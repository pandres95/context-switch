import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { JsonStorage } from "../../../src/plugins/storage/json";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

function tempPath() {
  return join(tmpdir(), `context-switch-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
}

describe("JsonStorage", () => {
  let storage: JsonStorage;
  let filePath: string;

  beforeEach(() => {
    filePath = tempPath();
    storage = new JsonStorage(filePath);
  });

  afterEach(() => {
    if (existsSync(filePath)) unlinkSync(filePath);
  });

  it("saves a stash and lists it for the correct context", () => {
    storage.save("personal", "nota json");
    const list = storage.list("personal");
    expect(list).toHaveLength(1);
    expect(list[0].text).toBe("nota json");
    expect(list[0].context).toBe("personal");
  });

  it("only returns stashes for the requested context", () => {
    storage.save("personal", "personal");
    storage.save("bloque", "trabajo");
    expect(storage.list("personal")).toHaveLength(1);
    expect(storage.list("bloque")).toHaveLength(1);
    expect(storage.list("u")).toHaveLength(0);
  });

  it("returns stashes in reverse chronological order", async () => {
    storage.save("personal", "primero");
    await new Promise((r) => setTimeout(r, 5));
    storage.save("personal", "segundo");
    expect(storage.list("personal")[0].text).toBe("segundo");
  });

  it("deletes a stash by id", () => {
    storage.save("personal", "a borrar");
    const [stash] = storage.list("personal");
    storage.delete(stash.id);
    expect(storage.list("personal")).toHaveLength(0);
  });

  it("only deletes the stash with the matching id", () => {
    storage.save("personal", "queda");
    storage.save("personal", "se va");
    const toDelete = storage.list("personal").find((s) => s.text === "se va")!;
    storage.delete(toDelete.id);
    const remaining = storage.list("personal");
    expect(remaining).toHaveLength(1);
    expect(remaining[0].text).toBe("queda");
  });

  it("counts stashes per context", () => {
    storage.save("personal", "a");
    storage.save("personal", "b");
    storage.save("bloque", "c");
    expect(storage.count("personal")).toBe(2);
    expect(storage.count("bloque")).toBe(1);
    expect(storage.count("u")).toBe(0);
  });

  it("persists data across instances pointing to the same file", () => {
    storage.save("personal", "persistente");
    const storage2 = new JsonStorage(filePath);
    expect(storage2.list("personal")).toHaveLength(1);
    expect(storage2.list("personal")[0].text).toBe("persistente");
  });

  it("assigns incrementing unique ids across saves", () => {
    storage.save("personal", "x");
    storage.save("bloque", "y");
    storage.save("personal", "z");
    const allIds = [
      ...storage.list("personal").map((s) => s.id),
      ...storage.list("bloque").map((s) => s.id),
    ];
    expect(new Set(allIds).size).toBe(3);
  });
});
