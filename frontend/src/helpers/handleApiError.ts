export function handleApiError(error: any): string {
  if (!error) return "Terjadi kesalahan tak terduga.";

  const response = error?.response;

  if (response?.data?.message) {
    return response.data.message;
  }

  if (response?.status === 400 && response?.data?.errors) {
    const errors = response.data.errors;
    return Object.values(errors).flat().join(", ");
  }

  if (error?.message?.includes("Network Error")) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  }

  return "Terjadi kesalahan. Coba lagi nanti.";
}
