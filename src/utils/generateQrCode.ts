import QRCode from "qrcode";

export default async function generateQrCode (url: string) {
    return QRCode.toBuffer(url)
}