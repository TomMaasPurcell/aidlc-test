import fs from "fs/promises";
import path from "path";

const baseDir = process.cwd();

const userDir = (username) => path.join(baseDir, "data", "users", username);

const readJson = async (file, fallback) => {
    try {
        const raw = await fs.readFile(file, "utf-8");
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

const writeJson = async (file, data) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
};

export const getUser = (username) =>
    readJson(path.join(userDir(username), "user.json"), null);

export const createUser = async (username, passwordHash) => {
    await fs.mkdir(userDir(username), { recursive: true });
    await writeJson(path.join(userDir(username), "user.json"), {
        username,
        passwordHash
    });
    await writeJson(path.join(userDir(username), "coins.json"), []);
};

export const getCoins = (username) =>
    readJson(path.join(userDir(username), "coins.json"), []);

export const saveCoins = (username, coins) =>
    writeJson(path.join(userDir(username), "coins.json"), coins);
