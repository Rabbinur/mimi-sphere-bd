const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

// Cache to prevent duplicate client-side events triggered in quick succession (e.g., React Strict Mode)
const firedEvents = new Set<string>();

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : undefined;
};

export const getOrCreateFbc = (): string | undefined => {
  const existingFbc = getCookie("_fbc");
  if (existingFbc) return existingFbc;

  // Fallback: If cookie doesn't exist yet but fbclid is in the URL, construct and set it
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get("fbclid");
    if (fbclid) {
      const newFbc = `fb.1.${Date.now()}.${fbclid}`;
      const expiry = new Date();
      expiry.setTime(expiry.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
      document.cookie = `_fbc=${newFbc}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
      return newFbc;
    }
  }
  return undefined;
};

export const getOrCreateFbp = (): string => {
  const existingFbp = getCookie("_fbp");
  if (existingFbp) return existingFbp;

  // Generate and set _fbp cookie if missing (helps with match quality for ad-blocker users)
  const creationTime = Date.now();
  const randomKey = Math.floor(Math.random() * 10000000000); // 10-digit random number
  const newFbp = `fb.1.${creationTime}.${randomKey}`;

  if (typeof document !== "undefined") {
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + 2 * 365 * 24 * 60 * 60 * 1000); // 2 years
    document.cookie = `_fbp=${newFbp}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
  }

  return newFbp;
};

export const getOrCreateGuestId = (): string => {
  if (typeof window === "undefined") return "";
  const key = "guest_user_id";
  let guestId = localStorage.getItem(key);
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    localStorage.setItem(key, guestId);
  }
  return guestId;
};

const getPersistedUserInfo = (): Record<string, any> => {
  if (typeof window === "undefined") return {};
  try {
    const rawAuth = localStorage.getItem("persist:auth");
    if (!rawAuth) return {};
    const parsedAuth = JSON.parse(rawAuth);
    if (parsedAuth && parsedAuth.userInfo) {
      const userInfo = typeof parsedAuth.userInfo === "string"
        ? JSON.parse(parsedAuth.userInfo)
        : parsedAuth.userInfo;
      return userInfo || {};
    }
  } catch (e) {
    // Ignore error
  }
  return {};
};

export const trackGAEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
    console.log(`[GA4 Tracking Event: ${eventName}]`, params);
  }
};

export const trackPixelEvent = async (
  eventName: string,
  customData: Record<string, any> = {},
  userData: Record<string, any> = {},
  eventId?: string
) => {
  // Prevent duplicate events within 1 second for the exact same name and data
  const dedupeKey = `${eventName}_${JSON.stringify(customData)}`;
  if (firedEvents.has(dedupeKey)) {
    return eventId || "";
  }
  firedEvents.add(dedupeKey);
  // Clear after 1 second to allow future distinct events
  setTimeout(() => {
    firedEvents.delete(dedupeKey);
  }, 1000);

  const finalEventId = eventId || `evt_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

  // Hook for Google Analytics 4 Ecommerce tracking
  if (eventName === "AddToCart") {
    trackGAEvent("add_to_cart", {
      currency: customData.currency || "BDT",
      value: Number(customData.value) || 0,
      items: [
        {
          item_id: customData.content_ids?.[0] || "",
          item_name: customData.content_name || "",
          price: customData.quantity
            ? Number(customData.value) / Number(customData.quantity)
            : Number(customData.value),
          quantity: Number(customData.quantity) || 1,
        },
      ],
    });
  }

  const fbp = getOrCreateFbp();
  const fbc = getOrCreateFbc();

  // Retrieve logged-in userInfo and format name fields if missing
  const persistedUser = getPersistedUserInfo();
  let fn = userData.fn;
  let ln = userData.ln;
  if (!fn && !ln && persistedUser.name) {
    const nameParts = String(persistedUser.name).trim().split(/\s+/);
    fn = nameParts[0] || "";
    ln = nameParts.slice(1).join(" ") || "";
  }

  const mergedUserData = {
    em: userData.em || persistedUser.email || "",
    ph: userData.ph || persistedUser.phone || "",
    fn: fn || "",
    ln: ln || "",
    external_id: userData.external_id || persistedUser._id || persistedUser.id || getOrCreateGuestId(),
    ct: userData.ct || "",
    st: userData.st || "",
    zp: userData.zp || "",
    country: userData.country || (userData.ct || userData.st ? "bd" : ""),
  };

  // Clean empty/falsy properties
  const cleanUserData: Record<string, any> = {};
  Object.entries(mergedUserData).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      cleanUserData[key] = val;
    }
  });

  // Log to browser console for verification (including fbp and fbc if available)
  if (typeof window !== "undefined") {
    console.log(`[Meta Tracking Event: ${eventName}]`, {
      eventId: finalEventId,
      customData,
      userData: {
        ...cleanUserData,
        fbc,
        fbp,
      },
    });
  }

  // 1. Browser Pixel Track
  if (typeof window !== "undefined" && (window as any).fbq) {
    if (Object.keys(cleanUserData).length > 0) {
      // Re-initialize with user data for Advanced Matching
      (window as any).fbq("init", "944264131793566", cleanUserData);
    }
    (window as any).fbq("track", eventName, customData, { eventID: finalEventId });
  }

  // 2. Server CAPI Track via the local API proxy
  // Skip CAPI proxy for Purchase because the backend controllers (COD/bKash) handle it directly
  if (eventName === "Purchase") {
    return finalEventId;
  }

  try {
    const payload = {
      eventName,
      eventId: finalEventId,
      userData: {
        ...cleanUserData,
        fbc,
        fbp,
      },
      customData,
      eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    fetch(`${API_BASE}/meta-events/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("CAPI fetch error:", err));
  } catch (error) {
    console.error("CAPI error:", error);
  }

  return finalEventId;
};
