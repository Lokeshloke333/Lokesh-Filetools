export type QRType = "Text" | "URL" | "Email" | "Phone" | "SMS" | "WiFi" | "vCard";

export interface QRData {
  type: QRType;
  text: string;
  url: string;
  email: { address: string; subject: string; body: string };
  phone: string;
  sms: { number: string; message: string };
  wifi: { ssid: string; password: string; encryption: string; hidden: boolean };
  vcard: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
}

export interface QRSettings {
  fgColor: string;
  bgColor: string;
  margin: number;
  size: number;
  level: "L" | "M" | "Q" | "H";
  logo: string | null;
  logoSize: number;
  logoWidth?: number;
  logoHeight?: number;
}
