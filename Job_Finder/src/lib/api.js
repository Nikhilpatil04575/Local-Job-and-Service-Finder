const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8092/LocalJobApp/request";

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data?.msg || "Something went wrong");
  if (data?.status && data.status !== "SUCCESS")
    throw new Error(data?.msg || "Request failed");
  return data;
};

// "Govind Sharma" → { firstName: "Govind", lastName: "Sharma" }
const splitName = (fullName = "") => {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

// ── USER REGISTER ─────────────────────────────────────────────────────────────
export const userRegister = async (payload) => {
  const { firstName, lastName } = splitName(payload.name);
  const response = await fetch(`${baseURL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      mobileNo:  payload.phone,
      emailId:   payload.email,
      address:   payload.address || payload.city || "",
      location:  payload.location || payload.city || "",
      city:      payload.city,
      userName:  payload.userName,
      password:  payload.password,
      role:      "USER",
    }),
  });
  return handleResponse(response);
};

// ── USER LOGIN ────────────────────────────────────────────────────────────────
export const userLogin = async (payload) => {
  const response = await fetch(`${baseURL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: payload.userName,
      password: payload.password,
      role:     "USER",
    }),
  });
  return handleResponse(response);
};

// ── USER LOGOUT ───────────────────────────────────────────────────────────────
export const userLogout = async (payload) => {
  const response = await fetch(`${baseURL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: payload.userName }),
  });
  return handleResponse(response);
};

// ── SP REGISTER ───────────────────────────────────────────────────────────────
// FIX: firstName + firmName + serviceName सगळं backend ला पाठवतो
export const spRegister = async (payload) => {
  const { firstName } = splitName(payload.name);
  const response = await fetch(`${baseURL}/serviceProvider`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName:   firstName || payload.name,   // PROVIDER_NAME column
      firmName:    payload.name,                // FIRM_NAME column
      mobileNo:    payload.phone,
      emailId:     payload.email,
      address:     payload.address || payload.city || "",
      location:    payload.location || payload.city || "",
      city:        payload.city,
      userName:    payload.userName,
      password:    payload.password,
      serviceName: payload.serviceType,         // FIX: SERVICE_NAME column
      serviceType: payload.serviceType,
      description: payload.description || "",
    }),
  });
  return handleResponse(response);
};

// ── SP LOGIN ──────────────────────────────────────────────────────────────────
export const spLogin = async (payload) => {
  const response = await fetch(`${baseURL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: payload.userName,
      password: payload.password,
      role:     "PROVIDER",
    }),
  });
  return handleResponse(response);
};

// ── SP UPDATE ─────────────────────────────────────────────────────────────────
export const spUpdate = async (payload) => {
  const response = await fetch(`${baseURL}/providerUpdate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id:          payload.id,
      serviceName: payload.serviceType,
      city:        payload.city,
      location:    payload.location,
    }),
  });
  return handleResponse(response);
};

// ── LOGOUT (clears localStorage) ──────────────────────────────────────────────
export const logoutUser = async () => {
  const userName = localStorage.getItem("userName");
  if (userName) {
    try {
      await fetch(`${baseURL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName }),
      });
    } catch {}
  }
  localStorage.clear();
};

// ── SEARCH PROVIDERS ──────────────────────────────────────────────────────────
export const getProvidersByService = async ({ serviceType, city, location }) => {
  const params = new URLSearchParams();
  if (serviceType) params.set("serviceType", serviceType);
  if (city)        params.set("city", city);
  if (location)    params.set("location", location);
  const response = await fetch(`${baseURL}/providers?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(response);
};

// ── BOOKING: Create ───────────────────────────────────────────────────────────
export const createBooking = async (payload) => {
  const response = await fetch(`${baseURL}/booking/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      providerId:   payload.providerId,
      userId:       payload.userId,
      userName:     payload.userName,
      providerName: payload.providerName,
      serviceName:  payload.serviceName,
      description:  payload.description || "",
      address:      payload.address     || "",
      city:         payload.city        || "",
      location:     payload.location    || "",
    }),
  });
  return handleResponse(response);
};

// ── BOOKING: Confirm ──────────────────────────────────────────────────────────
export const confirmBooking = async (payload) => {
  const response = await fetch(`${baseURL}/booking/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookingId:     payload.bookingId,
      serviceCharge: payload.serviceCharge || "",
    }),
  });
  return handleResponse(response);
};

// ── BOOKING: Reject ───────────────────────────────────────────────────────────
export const rejectBooking = async (payload) => {
  const response = await fetch(`${baseURL}/booking/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId: payload.bookingId }),
  });
  return handleResponse(response);
};

// ── BOOKING: Complete ─────────────────────────────────────────────────────────
export const completeBooking = async (payload) => {
  const response = await fetch(`${baseURL}/booking/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId: payload.bookingId }),
  });
  return handleResponse(response);
};

// ── BOOKING: Cancel ───────────────────────────────────────────────────────────
export const cancelBooking = async (payload) => {
  const response = await fetch(`${baseURL}/booking/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId: payload.bookingId }),
  });
  return handleResponse(response);
};

// ── BOOKING: Get by User ──────────────────────────────────────────────────────
export const getBookingsByUser = async (userId) => {
  const response = await fetch(`${baseURL}/booking/user?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await handleResponse(response);
  // Return the actual array so the UI can .map() over it
  return data.responseMap?.bookings || []; 
};

// ── BOOKING: Get by Provider ──────────────────────────────────────────────────
export const getBookingsByProvider = async (providerId) => {
  const response = await fetch(`${baseURL}/booking/provider?providerId=${providerId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await handleResponse(response);
  // Return the actual array so the UI can .map() over it
  return data.responseMap?.bookings || []; 
};
