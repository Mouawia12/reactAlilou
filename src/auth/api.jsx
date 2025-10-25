export async function apiFetch(endpoint, options = {}) {
    const token = sessionStorage.getItem("token");

    // ✅ Detect if the request body is FormData
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...options.headers,
    };

    // ✅ Only set Content-Type for non-FormData
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    // ✅ Add Authorization if exists
    if (token) {
        headers["Authorization"] = token;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
    });

    // ✅ Handle expired tokens
    if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = "/login";
    }

    return response;
}

/*export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {

        headers["Authorization"] = token;
    }
    const response = await fetch(endpoint, {
        ...options,
        headers,
    });

    // Auto logout if token expired
    if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = "/login";
    }

    return response;
}*/
