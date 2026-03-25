/**
 * getFileUrl - Converts a relative upload path (e.g. "/uploads/file.pdf")
 * into an absolute backend URL using the VITE_API_BASE_URL environment variable.
 *
 * The API base URL typically ends with "/api" (e.g. "http://localhost:5000/api").
 * This strips the "/api" suffix so we point directly to the static-file root.
 *
 * Usage:
 *   import { getFileUrl } from '@/utils/fileUrl';
 *   <a href={getFileUrl(material.fileUrl)} download>Download</a>
 */
export const getFileUrl = (relativePath) => {
    if (!relativePath) return '#';
    // If it's already a full URL, return as-is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    // Strip trailing "/api" from the base URL so we get the server root
    const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '');
    // Ensure exactly one slash between base and path
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${base}${path}`;
};
