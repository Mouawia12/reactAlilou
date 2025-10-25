import Swal from "sweetalert2";
import {apiFetch} from "../auth/api";
import { jwtDecode } from "jwt-decode";


export function MyAlert(message, icon, title) {
    //"info" | "success" | "warning" | "error" | "question"
    Swal.fire({
        position: "center",
        icon: icon,
        title: title,
        text: message,
        showConfirmButton: icon !== "success", // only show button if not success
        confirmButtonText: "OK",
        width: 600,
        padding: '2rem',
        //fontSize: '1.2rem',
        timer: icon === "success" ? 2000 : undefined, // auto-close only for success
    });
}

export function confirmLogout(navigate) {
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out from your session!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, logout",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // 🔑 get token from sessionStorage
               // const token = sessionStorage.getItem("token");

                // 🚀 call backend logout
                const response = await apiFetch(process.env.REACT_APP_API_BASE_URL+'/api/auth/logout', {
                    method: "POST",
                });

                if (!response.ok) {
                    throw new Error("Logout failed from backend");
                }

                // 🧹 clear local session
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");

                MyAlert("You have been logged out.","success","Logged out!")

                // redirect to login page
                navigate("/login");
            } catch (error) {
                MyAlert("Failed to log out. Try again.","error","Error")

            }
        }
    });
}

export const isAuthenticated = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
            return true;
        } else {
            // Token expired → clear session
            sessionStorage.clear();
            return false;
        }
    } catch (err) {
        sessionStorage.clear();
        return false;
    }
};

export function MyLoading(message){
    Swal.fire({
        title: "Loading...",
        text: message,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}

export function MyLoadingClose(){
    Swal.close();
}

export function fileToBase64 (file)  {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // strip prefix
        reader.onerror = (error) => reject(error);
    });
};

export function NumberFormat(value){
    if (value == null || isNaN(value)) return "";
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "DZD",
        minimumFractionDigits: 2,
    }).format(value);
}

export async function handleDownload(data) {
    try {

        const res = await apiFetch(
            `${process.env.REACT_APP_API_BASE_URL}${data.documentUrl}`,
            {method: "GET"}
        );

        if (!res.ok) throw new Error("File not found or unauthorized");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = data.documentName || `${data.id}`;
        link.click();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        MyAlert("Error saving order: " + err.message, "error", "Error");
    }
}

export async function handlePreview(data) {
    try {
        const url = `${process.env.REACT_APP_API_BASE_URL}${data.documentUrl}`;

        const res = await apiFetch(url, { method: "GET" });

        if (!res.ok) throw new Error("File not found or unauthorized");

        const blob = await res.blob();
        const fileType = blob.type; // e.g. "application/pdf" or "image/png"
        const previewUrl = window.URL.createObjectURL(blob);

        if (fileType.startsWith("application/pdf") || fileType.startsWith("image/")) {
            // ✅ open PDF or image in a new tab
            window.open(previewUrl, "_blank");
        } else {
            // fallback: download file
            const link = document.createElement("a");
            link.href = previewUrl;
            link.download = data.documentName || ` ${data.id}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // optional cleanup later
        setTimeout(() => window.URL.revokeObjectURL(previewUrl), 10000);
    } catch (err) {
        MyAlert("Error previewing file: " + err.message, "error", "Error");
    }
}



export async function handlePrintFile(data, setVisible, setPdfUrl, endpoint, errorTitle = "Erreur") {
    try {
        const result = await Swal.fire({
            title: "Confirmer l'impression de la facture",
            html: `
                    <p style="font-size:16px; font-weight:500;">Souhaitez-vous imprimer la facture avec cachet ?</p>
                    <div style="display:flex; align-items:center; margin-top:15px; gap:10px;">
                        <input 
                            type="checkbox" 
                            id="withStampCheckbox"
                            style="width: 22px;height: 22px;cursor: pointer;accent-color: #28a745;transform: scale(1.2);"
                        />
                        <label for="withStampCheckbox" style="font-size:18px; cursor:pointer;">
                            Imprimer avec cachet
                        </label>
                    </div>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Imprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#dc3545",
            reverseButtons: true,
        });
        const iscache =document.getElementById("withStampCheckbox").checked;  // true if checked, false otherwise
        const payload = { ...data, iscache };
        const res = await apiFetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Échec de la génération du fichier");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setVisible(true);
    } catch (err) {
        MyAlert(`Erreur lors de la génération du fichier : ${err.message}`, "error", errorTitle);
    }
}


