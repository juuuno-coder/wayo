import { API_BASE_URL } from "@/config";

export async function uploadInvitationImage(invitationId: string | number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/invitations/${invitationId}/upload_image`, {
        method: "POST",
        headers: {
            "Authorization": token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : ""
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.url;
}
