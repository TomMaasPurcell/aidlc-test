import express from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { createUser, getCoins, getUser, saveCoins } from "./storage.js";

const app = express();
const sessions = new Map();
const denominations = new Set(["Farthing", "Shilling", "Penny", "Florin"]);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

const hash = (password) =>
    crypto.createHash("sha256").update(password).digest("hex");

const auth = (req, res, next) => {
    const token = req.cookies.session;
    const username = sessions.get(token);
    if (!username) return res.status(401).json({ error: "unauthorized" });
    req.user = username;
    next();
};

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).send("Invalid input");
    const existing = await getUser(username);
    if (existing) return res.status(409).send("User exists");
    await createUser(username, hash(password));
    res.json({ ok: true });
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).send("Invalid input");
    const user = await getUser(username);
    if (!user || user.passwordHash !== hash(password))
        return res.status(401).send("Invalid credentials");
    const token = crypto.randomUUID();
    sessions.set(token, username);
    res.cookie("session", token, { httpOnly: true, sameSite: "lax" });
    res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
    const token = req.cookies.session;
    if (token) sessions.delete(token);
    res.clearCookie("session");
    res.json({ ok: true });
});

app.get("/api/coins", auth, async (req, res) => {
    const coins = await getCoins(req.user);
    res.json(coins);
});

app.post("/api/coins", auth, async (req, res) => {
    const { denomination, faceValue, year, issuingAuthority, image } =
        req.body || {};
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (
        !denominations.has(denomination) ||
        !faceValue ||
        !issuingAuthority ||
        !Number.isInteger(yearNum) ||
        yearNum < 1 ||
        yearNum > currentYear ||
        (image && !String(image).startsWith("data:image/jpeg;base64,"))
    ) {
        return res.status(400).send("Invalid coin data");
    }

    const coins = await getCoins(req.user);
    const coin = {
        id: crypto.randomUUID(),
        denomination,
        faceValue,
        year: yearNum,
        issuingAuthority,
        image: image || ""
    };
    coins.push(coin);
    await saveCoins(req.user, coins);
    res.json(coin);
});

app.delete("/api/coins/:id", auth, async (req, res) => {
    const coins = await getCoins(req.user);
    const filtered = coins.filter((c) => c.id !== req.params.id);
    await saveCoins(req.user, filtered);
    res.json({ ok: true });
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});
