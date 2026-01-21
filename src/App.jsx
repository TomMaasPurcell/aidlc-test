import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const denominations = ["Farthing", "Shilling", "Penny", "Florin"];

export default function App() {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [loggedIn, setLoggedIn] = useState(false);
    const [coins, setCoins] = useState([]);
    const [authMode, setAuthMode] = useState("login");
    const [authForm, setAuthForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [coinForm, setCoinForm] = useState({
        denomination: "Farthing",
        faceValue: "",
        year: "",
        issuingAuthority: "",
        image: ""
    });

    const loadCoins = async () => {
        try {
            const data = await api.getCoins();
            setCoins(data || []);
            setLoggedIn(true);
            setError("");
        } catch (e) {
            if (e.status !== 401) setError(e.message);
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        loadCoins();
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (authMode === "login") {
                await api.login(authForm);
            } else {
                await api.register(authForm);
                await api.login(authForm);
            }
            setAuthForm({ username: "", password: "" });
            await loadCoins();
        } catch (e2) {
            setError(e2.message);
        }
    };

    const handleLogout = async () => {
        await api.logout();
        setLoggedIn(false);
        setCoins([]);
    };

    const handleImage = (file) => {
        if (!file) return setCoinForm((f) => ({ ...f, image: "" }));
        if (file.type !== "image/jpeg") {
            setError("Image must be JPEG.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () =>
            setCoinForm((f) => ({ ...f, image: reader.result || "" }));
        reader.readAsDataURL(file);
    };

    const handleAddCoin = async (e) => {
        e.preventDefault();
        setError("");
        const yearNum = Number(coinForm.year);
        if (
            !coinForm.faceValue ||
            !coinForm.issuingAuthority ||
            !denominations.includes(coinForm.denomination) ||
            !Number.isInteger(yearNum) ||
            yearNum < 1 ||
            yearNum > currentYear
        ) {
            setError("Please enter valid coin details.");
            return;
        }
        try {
            const created = await api.addCoin({
                ...coinForm,
                year: yearNum
            });
            setCoins((c) => [...c, created]);
            setModalOpen(false);
            setCoinForm({
                denomination: "Farthing",
                faceValue: "",
                year: "",
                issuingAuthority: "",
                image: ""
            });
        } catch (e2) {
            setError(e2.message);
        }
    };

    const handleDelete = async (id) => {
        await api.deleteCoin(id);
        setCoins((c) => c.filter((x) => x.id !== id));
    };

    if (!loggedIn) {
        return (
            <div className="container">
                <h1>Coin Collection</h1>
                <form className="card" onSubmit={handleAuth}>
                    <h2>{authMode === "login" ? "Login" : "Register"}</h2>
                    <input
                        placeholder="Username"
                        value={authForm.username}
                        onChange={(e) =>
                            setAuthForm((f) => ({ ...f, username: e.target.value }))
                        }
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={authForm.password}
                        onChange={(e) =>
                            setAuthForm((f) => ({ ...f, password: e.target.value }))
                        }
                    />
                    <button type="submit">
                        {authMode === "login" ? "Login" : "Register"}
                    </button>
                    <button
                        type="button"
                        className="link"
                        onClick={() =>
                            setAuthMode((m) => (m === "login" ? "register" : "login"))
                        }
                    >
                        {authMode === "login" ? "Create account" : "Have an account?"}
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="toolbar">
                <h1>My Coins</h1>
                <div className="actions">
                    <button onClick={() => setModalOpen(true)}>Add Coin</button>
                    <button className="secondary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {error && <p className="error">{error}</p>}

            <div className="grid">
                {coins.map((coin) => (
                    <div className="tile" key={coin.id}>
                        <button className="delete" onClick={() => handleDelete(coin.id)}>
                            ×
                        </button>
                        {coin.image && <img src={coin.image} alt="coin" />}
                        <div className="meta">
                            <div>{coin.denomination}</div>
                            <div>Face: {coin.faceValue}</div>
                            <div>Year: {coin.year}</div>
                            <div>Issuer: {coin.issuingAuthority}</div>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="card">
                        <h2>Add Coin</h2>
                        <form onSubmit={handleAddCoin}>
                            <label>
                                Denomination
                                <select
                                    value={coinForm.denomination}
                                    onChange={(e) =>
                                        setCoinForm((f) => ({
                                            ...f,
                                            denomination: e.target.value
                                        }))
                                    }
                                >
                                    {denominations.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Face Value
                                <input
                                    value={coinForm.faceValue}
                                    onChange={(e) =>
                                        setCoinForm((f) => ({ ...f, faceValue: e.target.value }))
                                    }
                                />
                            </label>
                            <label>
                                Year
                                <input
                                    type="number"
                                    value={coinForm.year}
                                    onChange={(e) =>
                                        setCoinForm((f) => ({ ...f, year: e.target.value }))
                                    }
                                />
                            </label>
                            <label>
                                Issuing Authority
                                <input
                                    value={coinForm.issuingAuthority}
                                    onChange={(e) =>
                                        setCoinForm((f) => ({
                                            ...f,
                                            issuingAuthority: e.target.value
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Image (JPEG)
                                <input
                                    type="file"
                                    accept="image/jpeg"
                                    onChange={(e) => handleImage(e.target.files?.[0])}
                                />
                            </label>
                            <div className="actions">
                                <button type="submit">Add Coin</button>
                                <button
                                    type="button"
                                    className="secondary"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
