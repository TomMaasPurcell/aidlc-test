const request = async (path, options = {}) => {
    const res = await fetch(path, {
        credentials: "include",
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
        ...options
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        const err = new Error(msg || res.statusText);
        err.status = res.status;
        throw err;
    }

    const contentType = res.headers.get("content-type") || "";
    return contentType.includes("application/json") ? res.json() : null;
};

export const api = {
    register: (payload) =>
        request("/api/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) =>
        request("/api/login", { method: "POST", body: JSON.stringify(payload) }),
    logout: () => request("/api/logout", { method: "POST" }),
    getCoins: () => request("/api/coins"),
    addCoin: (payload) =>
        request("/api/coins", { method: "POST", body: JSON.stringify(payload) }),
    deleteCoin: (id) => request(`/api/coins/${id}`, { method: "DELETE" })
};
