/**
 * Determines if the current environment is development.
 *
 * Checks if the current window location does not include 'synogun.github.io',
 * which is used to identify the production environment.
 *
 * @returns {boolean} `true` if running in development mode, otherwise `false`.
 */
export function isDev(): boolean {
    return import.meta.env.DEV;
}

/**
 * Creates a file from a data string and initiates a download in the browser.
 *
 * This function handles two cases:
 * 1. For image types ('png', 'jpg'), it assumes `dataStr` is a data URL and creates a download link directly.
 * 2. For other file types, it creates a Blob from `dataStr`, generates an object URL, and then initiates the download.
 *
 * After triggering the download, it cleans up by removing the temporary `<a>` element and revoking the object URL if one was created.
 *
 * @param dataStr - The content of the file as a string. For images, this should be a data URL. For other types, it's the raw file content.
 * @param fileName - The name for the downloaded file.
 * @param fileType - The MIME type of the file (e.g., 'text/plain', 'application/json') or a simple type identifier ('png', 'jpg').
 * @param exportFormat - Optional. The file extension to append to the `fileName`, primarily used for image downloads.
 */
export function makeBlobAndDownload(
    dataStr: string,
    fileName: string,
    fileType: string,
    exportFormat?: string
): void {
    if (fileType === 'png' || fileType === 'jpg') {
        const a = document.createElement('a');

        a.href = dataStr;
        a.download = `${fileName}.${exportFormat ?? ''}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    const blob = new Blob([dataStr], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
