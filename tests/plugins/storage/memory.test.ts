import { describe, it, expect, beforeEach } from "bun:test";
import { MemoryStorage } from "../../../src/plugins/storage/memory";

describe("MemoryStorage", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it("saves a stash and lists it for the correct context", () => {
    storage.save("personal", "nota de prueba");
    const list = storage.list("personal");
    expect(list).toHaveLength(1);
    expect(list[0].text).toBe("nota de prueba");
    expect(list[0].context).toBe("personal");
    expect(list[0].id).toBe(1);
  });

  it("only returns stashes for the requested context", () => {
    storage.save("personal", "nota personal");
    storage.save("bloque", "nota trabajo");
    expect(storage.list("personal")).toHaveLength(1);
    expect(storage.list("bloque")).toHaveLength(1);
    expect(storage.list("u")).toHaveLength(0);
  });

  it("returns stashes in reverse chronological order", async () => {
    storage.save("personal", "primero");
    await new Promise((r) => setTimeout(r, 5)); // small gap so timestamps differ
    storage.save("personal", "segundo");
    const list = storage.list("personal");
    expect(list[0].text).toBe("segundo");
    expect(list[1].text).toBe("primero");
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

  it("assigns incrementing unique ids", () => {
    storage.save("personal", "x");
    storage.save("personal", "y");
    const ids = storage.list("personal").map((s) => s.id);
    expect(new Set(ids).size).toBe(2);
  });
});
