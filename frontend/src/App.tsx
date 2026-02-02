import { useState } from "react";

type View = "login" | "register";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export default function App() {
    const [view, setView] = useState<View>("login");
    const [isAuthed, setIsAuthed] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    async function submit(path: "/register" | "/login") {
        setStatus(null);
        const res = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            setStatus("Request failed.");
            return;
        }
        setStatus("Success.");
        if (path === "/login") setIsAuthed(true);
    }

    async function logout() {
        setStatus(null);
        await fetch(`${API_BASE}/logout`, { method: "POST" });
        setIsAuthed(false);
    }

    return (
        <div className="page">
            <nav className="nav">
                {!isAuthed ? (
                    <>
                        <button onClick={() => setView("register")}>Register</button>
                        <button onClick={() => setView("login")}>Login</button>
                    </>
                ) : (
                    <>
                        <button aria-disabled="true">Profile</button>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </nav>

            {!isAuthed && (
                <form
                    className="auth"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(view === "register" ? "/register" : "/login");
                    }}
                >
                    <h2>{view === "register" ? "Register" : "Login"}</h2>
                    <label>
                        Username
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            minLength={3}
                            maxLength={30}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            type="password"
                            required
                        />
                    </label>
                    <button type="submit">{view === "register" ? "Register" : "Login"}</button>
                    {status && <div className="status">{status}</div>}
                </form>
            )}
        </div>
    );
}
