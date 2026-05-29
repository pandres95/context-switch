import { describe, it, expect, beforeEach } from "bun:test";
import { Database } from "bun:sqlite";
import { SqliteStorage } from "../../../src/plugins/storage/sqlite";

// SqliteStorage recibe cualquier DB que cumpla SqliteDb — aquí usamos bun:sqlite en memoria.
// La misma lógica corre en producción contra better-sqlite3 con un archivo real.

function makeStorage() {
  return new SqliteStorage(new Database(":memory:"));
}

describe("SqliteStorage", () => {
  let storage: SqliteStorage;

  beforeEach(() => {
    storage = makeStorage();
  });

  it("saves a stash and lists it for the correct context", () => {
    storage.save("personal", "nota sqlite");
    const list = storage.list("personal");
    expect(list).toHaveLength(1);
    expect(list[0].text).toBe("nota sqlite");
    expect(list[0].context).toBe("personal");
  });

  it("only returns stashes for the requested context", () => {
    storage.save("personal", "personal");
    storage.save("bloque", "trabajo");
    expect(storage.list("personal")).toHaveLength(1);
    expect(storage.list("bloque")).toHaveLength(1);
    expect(storage.list("u")).toHaveLength(0);
  });

  it("returns stashes in reverse chronological order", () => {
    storage.save("personal", "primero");
    storage.save("personal", "segundo");
    const list = storage.list("personal");
    expect(list[0].text).toBe("segundo");
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

  it("schema survives multiple saves and deletes without corruption", () => {
    for (let i = 0; i < 10; i++) storage.save("personal", `nota ${i}`);
    const all = storage.list("personal");
    storage.delete(all[0].id);
    storage.delete(all[1].id);
    expect(storage.count("personal")).toBe(8);
  });
});
