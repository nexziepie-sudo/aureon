
"use strict";

/* ==========================================
   AUREON GLOBAL SETTINGS
========================================== */

const AUREON_CONFIG = {
    // Obtain your access key from Web3Forms.
    // This is a browser-facing form key, not a private API secret.
    web3FormsAccessKey: "2430106f-cfb6-495d-80c7-938f84731794",

    // Set false to disable the live crypto connection.
    enableCryptoMarkets: true
};


/* ==========================================
   CURRENT YEAR
========================================== */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ==========================================
   MOBILE NAVIGATION
========================================== */

const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");

function openMenu() {
    if (!menuPanel || !menuOverlay || !menuButton) return;

    menuPanel.classList.add("active");
    menuOverlay.classList.add("active");

    menuPanel.inert = false;
    menuPanel.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");

    if (menuClose) menuClose.focus();
}

function closeMenu(returnFocus = false) {
    if (!menuPanel || !menuOverlay || !menuButton) return;

    menuPanel.classList.remove("active");
    menuOverlay.classList.remove("active");

    menuPanel.inert = true;
    menuPanel.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");

    if (returnFocus) {
        menuButton.focus();
    }
}

if (menuButton) {
    menuButton.addEventListener("click", () => {
        if (menuPanel.classList.contains("active")) {
            closeMenu(true);
        } else {
            openMenu();
        }
    });
}

if (menuClose) {
    menuClose.addEventListener("click", () => closeMenu(true));
}

if (menuOverlay) {
    menuOverlay.addEventListener("click", () => closeMenu(true));
}

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        menuPanel &&
        menuPanel.classList.contains("active")
    ) {
        closeMenu(true);
    }
});

if (menuPanel) {
    menuPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => closeMenu());
    });
}


/* ==========================================
   SERVICE PRESELECTION
========================================== */

const serviceSelect = document.getElementById("service");

document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
        const requestedService = link.dataset.service;

        if (!serviceSelect) return;

        const option = Array.from(serviceSelect.options).find(
            (item) => item.value === requestedService
        );

        if (option) {
            serviceSelect.value = option.value;
        }
    });
});


/* ==========================================
   CRYPTO MARKET CONFIGURATION
========================================== */

const coins = {
    btc: { symbol: "BTCUSDT" },
    eth: { symbol: "ETHUSDT" },
    bnb: { symbol: "BNBUSDT" },
    sol: { symbol: "SOLUSDT" },
    xrp: { symbol: "XRPUSDT" },
    doge: { symbol: "DOGEUSDT" }
};

const marketState = {
    socket: null,
    reconnectTimer: null,
    reconnectDelay: 2000,
    manuallyClosed: false
};

const connectionStatus = document.getElementById("connectionStatus");
const connectionText = document.getElementById("connectionText");

function setConnectionStatus(state, message) {
    if (connectionStatus) {
        connectionStatus.classList.remove(
            "connected",
            "disconnected"
        );

        if (state) {
            connectionStatus.classList.add(state);
        }
    }

    if (connectionText) {
        connectionText.textContent = message;
    }
}

function formatPrice(price) {
    return "$" + price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
    });
}

function formatChange(change) {
    const prefix = change > 0 ? "+" : "";

    return prefix + change.toFixed(2) + "%";
}


/* ==========================================
   UPDATE MARKET DISPLAY
========================================== */

function updatePrice(key, price, change) {
    if (!Number.isFinite(price) || !Number.isFinite(change)) {
        return;
    }

    const priceElement = document.getElementById(`price-${key}`);
    const changeElement = document.getElementById(`change-${key}`);

    const formattedPrice = formatPrice(price);
    const changeText = formatChange(change);

    // Market card price.
    if (priceElement) {
        priceElement.textContent = formattedPrice;
    }

    // Market card percentage change.
    if (changeElement) {
        changeElement.textContent = changeText + " · 24h";

        changeElement.classList.remove(
            "positive",
            "negative",
            "neutral"
        );

        changeElement.classList.add(
            change >= 0 ? "positive" : "negative"
        );
    }

    // Main ticker and duplicated ticker.
    const ticker = document.getElementById(`ticker-${key}`);
    const tickerDuplicate = document.getElementById(`ticker-${key}2`);

    [ticker, tickerDuplicate].forEach((element) => {
        if (!element) return;

        element.textContent = formattedPrice + " " + changeText;

        element.classList.remove("positive", "negative");
        element.classList.add(
            change >= 0 ? "positive" : "negative"
        );
    });
}


/* ==========================================
   BINANCE WEBSOCKET
========================================== */

function connectCryptoMarket() {
    if (!AUREON_CONFIG.enableCryptoMarkets) {
        setConnectionStatus("", "Market feed disabled");
        return;
    }

    // Avoid duplicate active connections.
    if (
        marketState.socket &&
        (
            marketState.socket.readyState === WebSocket.OPEN ||
            marketState.socket.readyState === WebSocket.CONNECTING
        )
    ) {
        return;
    }

    clearTimeout(marketState.reconnectTimer);

    const streams = Object.values(coins)
        .map((coin) => coin.symbol.toLowerCase() + "@ticker")
        .join("/");

    const websocketURL =
        "wss://stream.binance.com:9443/stream?streams=" + streams;

    setConnectionStatus("", "Connecting to market...");

    let socket;

    try {
        socket = new WebSocket(websocketURL);
        marketState.socket = socket;
    } catch (error) {
        console.error("AUREON WebSocket initialization failed:", error);
        scheduleReconnect();
        return;
    }

    socket.onopen = () => {
        if (marketState.socket !== socket) return;

        marketState.reconnectDelay = 2000;

        setConnectionStatus("connected", "Live market connected");

        console.log("AUREON live market connected.");
    };

    socket.onmessage = (event) => {
        if (marketState.socket !== socket) return;

        let response;

        try {
            response = JSON.parse(event.data);
        } catch (error) {
            console.warn("Invalid market message received.");
            return;
        }

        const data = response.data;

        if (!data || !data.s) return;

        const symbol = String(data.s).toUpperCase();

        const entry = Object.entries(coins).find(
            ([, coin]) => coin.symbol === symbol
        );

        if (!entry) return;

        const [key] = entry;

        const price = Number(data.c);
        const change = Number(data.P);

        updatePrice(key, price, change);
    };

    socket.onerror = () => {
        if (marketState.socket !== socket) return;

        setConnectionStatus(
            "disconnected",
            "Market connection issue"
        );

        console.warn("AUREON market connection error.");
    };

    socket.onclose = () => {
        if (marketState.socket !== socket) return;

        marketState.socket = null;

        if (!marketState.manuallyClosed) {
            setConnectionStatus(
                "disconnected",
                "Reconnecting to market..."
            );

            scheduleReconnect();
        }
    };
}


/* ==========================================
   AUTOMATIC RECONNECTION
========================================== */

function scheduleReconnect() {
    if (
        marketState.manuallyClosed ||
        !AUREON_CONFIG.enableCryptoMarkets
    ) {
        return;
    }

    clearTimeout(marketState.reconnectTimer);

    const delay = marketState.reconnectDelay;

    marketState.reconnectTimer = setTimeout(() => {
        connectCryptoMarket();
    }, delay);

    // Exponential backoff, capped at 30 seconds.
    marketState.reconnectDelay = Math.min(
        marketState.reconnectDelay * 2,
        30000
    );
}


/* ==========================================
   START / STOP MARKET FEED
========================================== */

function startCryptoMarket() {
    marketState.manuallyClosed = false;
    connectCryptoMarket();
}

function stopCryptoMarket() {
    marketState.manuallyClosed = true;

    clearTimeout(marketState.reconnectTimer);

    if (marketState.socket) {
        const socket = marketState.socket;
        marketState.socket = null;
        socket.close();
    }

    setConnectionStatus("", "Market feed stopped");
}

if (AUREON_CONFIG.enableCryptoMarkets) {
    startCryptoMarket();
}


/* ==========================================
   WEB3FORMS INQUIRY SUBMISSION
========================================== */

const inquiryForm = document.getElementById("inquiryForm");
const submitButton = document.getElementById("submitButton");
const formStatus = document.getElementById("formStatus");

function showFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove("success", "error");

    if (type) {
        formStatus.classList.add(type);
    }
}

if (inquiryForm) {
    inquiryForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        showFormStatus("", "");

        if (!inquiryForm.reportValidity()) {
            return;
        }

        const accessKey = AUREON_CONFIG.web3FormsAccessKey;

        if (
            !accessKey ||
            accessKey === "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY"
        ) {
            showFormStatus(
                "The inquiry form is not connected yet. Please configure the Web3Forms access key.",
                "error"
            );
            return;
        }

        const originalText = submitButton
            ? submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const formData = new FormData(inquiryForm);

            formData.set("access_key", accessKey);
            formData.set("subject", "New AUREON Service Inquiry");
            formData.set("from_name", "AUREON Website");

            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Submission failed."
                );
            }

            showFormStatus(
                "Your inquiry has been submitted successfully. Thank you for contacting AUREON.",
                "success"
            );

            inquiryForm.reset();

        } catch (error) {
            console.error("AUREON inquiry error:", error);

            showFormStatus(
                "We couldn't submit your inquiry. Please try again later.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    });
}