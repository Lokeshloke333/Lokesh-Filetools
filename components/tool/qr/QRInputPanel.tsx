"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Type, Link as LinkIcon, Mail, Phone, MessageSquare, Wifi, Contact } from "lucide-react";
import { QRData, QRType } from "./types";

interface QRInputPanelProps {
  data: QRData;
  onChange: (data: Partial<QRData>) => void;
}

export function QRInputPanel({ data, onChange }: QRInputPanelProps) {
  const handleTabChange = (val: string) => {
    onChange({ type: val as QRType });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Content</h2>
      
      <Tabs value={data.type} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-4 sm:flex sm:flex-wrap h-auto p-1 bg-slate-100/50 mb-6 gap-1 justify-start">
          <TabsTrigger value="URL" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LinkIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">URL</span>
          </TabsTrigger>
          <TabsTrigger value="Text" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Type className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="Email" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Mail className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="Phone" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Phone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Phone</span>
          </TabsTrigger>
          <TabsTrigger value="SMS" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" /> <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger value="WiFi" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Wifi className="w-3.5 h-3.5" /> <span className="hidden sm:inline">WiFi</span>
          </TabsTrigger>
          <TabsTrigger value="vCard" className="flex items-center gap-1.5 flex-1 min-w-[70px] text-xs h-9 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Contact className="w-3.5 h-3.5" /> <span className="hidden sm:inline">vCard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="URL" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input 
              type="url" 
              placeholder="https://example.com" 
              value={data.url}
              onChange={(e) => onChange({ url: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>
        </TabsContent>

        <TabsContent value="Text" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Your Text</Label>
            <Textarea 
              placeholder="Enter your message here..." 
              value={data.text}
              onChange={(e) => onChange({ text: e.target.value })}
              className="min-h-[120px] rounded-xl resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="Email" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input 
              type="email" 
              placeholder="hello@example.com" 
              value={data.email.address}
              onChange={(e) => onChange({ email: { ...data.email, address: e.target.value } })}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Subject (Optional)</Label>
            <Input 
              type="text" 
              placeholder="Email subject" 
              value={data.email.subject}
              onChange={(e) => onChange({ email: { ...data.email, subject: e.target.value } })}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Message (Optional)</Label>
            <Textarea 
              placeholder="Pre-filled email body..." 
              value={data.email.body}
              onChange={(e) => onChange({ email: { ...data.email, body: e.target.value } })}
              className="min-h-[80px] rounded-xl resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="Phone" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              type="tel" 
              placeholder="+1234567890" 
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>
        </TabsContent>

        <TabsContent value="SMS" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              type="tel" 
              placeholder="+1234567890" 
              value={data.sms.number}
              onChange={(e) => onChange({ sms: { ...data.sms, number: e.target.value } })}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea 
              placeholder="Pre-filled text message..." 
              value={data.sms.message}
              onChange={(e) => onChange({ sms: { ...data.sms, message: e.target.value } })}
              className="min-h-[80px] rounded-xl resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="WiFi" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <Label>Network Name (SSID)</Label>
            <Input 
              type="text" 
              placeholder="My WiFi Network" 
              value={data.wifi.ssid}
              onChange={(e) => onChange({ wifi: { ...data.wifi, ssid: e.target.value } })}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              type="text" 
              placeholder="Leave blank if open" 
              value={data.wifi.password}
              onChange={(e) => onChange({ wifi: { ...data.wifi, password: e.target.value } })}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Encryption</Label>
              <Select value={data.wifi.encryption} onValueChange={(val) => onChange({ wifi: { ...data.wifi, encryption: val } })}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch 
                id="hidden-wifi" 
                checked={data.wifi.hidden} 
                onCheckedChange={(checked) => onChange({ wifi: { ...data.wifi, hidden: checked } })} 
              />
              <Label htmlFor="hidden-wifi" className="cursor-pointer">Hidden Network</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vCard" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input 
                value={data.vcard.firstName}
                onChange={(e) => onChange({ vcard: { ...data.vcard, firstName: e.target.value } })}
                className="h-12 rounded-xl"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input 
                value={data.vcard.lastName}
                onChange={(e) => onChange({ vcard: { ...data.vcard, lastName: e.target.value } })}
                className="h-12 rounded-xl"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                type="tel"
                value={data.vcard.phone}
                onChange={(e) => onChange({ vcard: { ...data.vcard, phone: e.target.value } })}
                className="h-12 rounded-xl"
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={data.vcard.email}
                onChange={(e) => onChange({ vcard: { ...data.vcard, email: e.target.value } })}
                className="h-12 rounded-xl"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input 
                value={data.vcard.organization}
                onChange={(e) => onChange({ vcard: { ...data.vcard, organization: e.target.value } })}
                className="h-12 rounded-xl"
                placeholder="Company Inc."
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={data.vcard.title}
                onChange={(e) => onChange({ vcard: { ...data.vcard, title: e.target.value } })}
                className="h-12 rounded-xl"
                placeholder="Manager"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input 
              type="url"
              value={data.vcard.website}
              onChange={(e) => onChange({ vcard: { ...data.vcard, website: e.target.value } })}
              className="h-12 rounded-xl"
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea 
              value={data.vcard.address}
              onChange={(e) => onChange({ vcard: { ...data.vcard, address: e.target.value } })}
              className="min-h-[80px] rounded-xl resize-none"
              placeholder="123 Main St, City, Country"
            />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
