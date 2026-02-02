import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { createUser, findUserHash } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const USER_MIN = 3;
const USER_MAX = 30;
const PASS_MIN = 8;

function validUsername(username: string) {
    return username.length >= USER_MIN && username.length <= USER_MAX;
}
function validPassword(password: string) {
    return password.length >= PASS_MIN;
}

app.post("/register", async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password || !validUsername(username) || !validPassword(password)) {
        return res.status(400).json({ error: "Invalid credentials." });
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        await createUser(username, hash);
        return res.status(201).json({ ok: true });
    } catch {
        return res.status(400).json({ error: "Registration failed." });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
        return res.status(400).json({ error: "Invalid credentials." });
    }
    try {
        const hash = await findUserHash(username);
        if (!hash) return res.status(401).json({ error: "Invalid credentials." });
        const ok = await bcrypt.compare(password, hash);
        if (!ok) return res.status(401).json({ error: "Invalid credentials." });
        return res.json({ ok: true });
    } catch {
        return res.status(500).json({ error: "Login failed." });
    }
});

app.post("/logout", (_req, res) => {
    return res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
    console.log(`Backend listening on ${port}`);
});
