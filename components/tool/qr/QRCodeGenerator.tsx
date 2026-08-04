"use client";

import React, { useState, useMemo } from "react";
import { QRInputPanel } from "./QRInputPanel";
import { QRSettingsPanel } from "./QRSettingsPanel";
import { QRPreview } from "./QRPreview";
import { QRData, QRSettings } from "./types";

const INITIAL_DATA: QRData = {
  type: "URL",
  text: "",
  url: "https://fileinator.com",
  email: { address: "", subject: "", body: "" },
  phone: "",
  sms: { number: "", message: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: {
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    customFields: [],
  }
};

const INITIAL_SETTINGS: QRSettings = {
  fgColor: "#000000",
  bgColor: "#ffffff",
  margin: 4,
  size: 512,
  level: "M",
  logo: null,
  logoSize: 20
};

export function QRCodeGenerator() {
  const [data, setData] = useState<QRData>(INITIAL_DATA);
  const [settings, setSettings] = useState<QRSettings>(INITIAL_SETTINGS);

  const handleDataChange = (update: Partial<QRData>) => {
    setData(prev => ({ ...prev, ...update }));
  };

  const handleSettingsChange = (update: Partial<QRSettings>) => {
    setSettings(prev => ({ ...prev, ...update }));
  };

  const rawValue = useMemo(() => {
    switch (data.type) {
      case "URL":
        return data.url;
      case "Text":
        return data.text;
      case "Email":
        if (!data.email.address) return "";
        return `mailto:${data.email.address}?subject=${encodeURIComponent(data.email.subject)}&body=${encodeURIComponent(data.email.body)}`;
      case "Phone":
        if (!data.phone) return "";
        return `tel:${data.phone}`;
      case "SMS":
        if (!data.sms.number) return "";
        return `sms:${data.sms.number}:${data.sms.message}`;
      case "WiFi":
        if (!data.wifi.ssid) return "";
        return `WIFI:T:${data.wifi.encryption};S:${data.wifi.ssid};P:${data.wifi.password};H:${data.wifi.hidden};;`;
      case "vCard":
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${data.vcard.lastName};${data.vcard.firstName};;;`,
          `FN:${data.vcard.firstName} ${data.vcard.lastName}`.trim(),
          data.vcard.organization ? `ORG:${data.vcard.organization}` : "",
          data.vcard.title ? `TITLE:${data.vcard.title}` : "",
          data.vcard.phone ? `TEL;TYPE=WORK,VOICE:${data.vcard.phone}` : "",
          data.vcard.email ? `EMAIL:${data.vcard.email}` : "",
          data.vcard.website ? `URL:${data.vcard.website}` : "",
          data.vcard.address ? `ADR;TYPE=WORK:;;${data.vcard.address};;;;` : "",
          ...(data.vcard.customFields || []).flatMap((field, index) => [
            `item${index + 1}.URL:${field.value}`,
            `item${index + 1}.X-ABLabel:${field.label}`
          ]),
          "END:VCARD"
        ].filter(Boolean).join("\n");
      default:
        return "";
    }
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <QRInputPanel data={data} onChange={handleDataChange} />
        <QRSettingsPanel settings={settings} onChange={handleSettingsChange} />
      </div>
      <div className="lg:col-span-1">
        <QRPreview value={rawValue} settings={settings} />
      </div>
    </div>
  );
}
