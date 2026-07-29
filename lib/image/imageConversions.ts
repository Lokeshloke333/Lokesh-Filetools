export interface ImageConversion {
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  keywords: string[];
}

export const imageConversions: ImageConversion[] = [
  // From JPG
  {
    slug: "jpg-to-png",
    from: "JPG",
    to: "PNG",
    title: "Convert JPG to PNG",
    description: "Easily convert your JPG images to PNG format with transparent backgrounds. Fast, secure, and free online JPG to PNG converter.",
    keywords: ["jpg to png", "convert jpg to png", "jpeg to png", "image converter", "transparent png"]
  },
  {
    slug: "jpg-to-webp",
    from: "JPG",
    to: "WEBP",
    title: "Convert JPG to WEBP",
    description: "Optimize your JPG images by converting them to the next-gen WEBP format for faster website loading speeds.",
    keywords: ["jpg to webp", "convert jpg to webp", "jpeg to webp", "optimize images"]
  },
  {
    slug: "jpg-to-avif",
    from: "JPG",
    to: "AVIF",
    title: "Convert JPG to AVIF",
    description: "Convert JPG files to AVIF for the ultimate next-generation image compression and quality preservation.",
    keywords: ["jpg to avif", "convert jpg to avif", "jpeg to avif", "avif converter"]
  },
  
  // From PNG
  {
    slug: "png-to-jpg",
    from: "PNG",
    to: "JPG",
    title: "Convert PNG to JPG",
    description: "Easily convert your PNG images to JPG format to reduce file size. Fast, secure, and free online PNG to JPG converter.",
    keywords: ["png to jpg", "convert png to jpg", "png to jpeg", "reduce image size"]
  },
  {
    slug: "png-to-webp",
    from: "PNG",
    to: "WEBP",
    title: "Convert PNG to WEBP",
    description: "Optimize your PNG images by converting them to WEBP for better performance on the web while retaining transparency.",
    keywords: ["png to webp", "convert png to webp", "transparent webp", "optimize images"]
  },
  {
    slug: "png-to-avif",
    from: "PNG",
    to: "AVIF",
    title: "Convert PNG to AVIF",
    description: "Convert PNG files to AVIF for incredible file size savings while maintaining high visual fidelity and transparency.",
    keywords: ["png to avif", "convert png to avif", "avif format", "image compression"]
  },

  // From WEBP
  {
    slug: "webp-to-jpg",
    from: "WEBP",
    to: "JPG",
    title: "Convert WEBP to JPG",
    description: "Convert WEBP images back to standard JPG format for maximum compatibility across all devices and legacy software.",
    keywords: ["webp to jpg", "convert webp to jpg", "webp to jpeg", "image converter"]
  },
  {
    slug: "webp-to-png",
    from: "WEBP",
    to: "PNG",
    title: "Convert WEBP to PNG",
    description: "Convert WEBP images to PNG format to maintain lossless quality and transparency.",
    keywords: ["webp to png", "convert webp to png", "transparent png"]
  },
  {
    slug: "webp-to-avif",
    from: "WEBP",
    to: "AVIF",
    title: "Convert WEBP to AVIF",
    description: "Upgrade your WEBP images to AVIF for even better compression and modern web performance.",
    keywords: ["webp to avif", "convert webp to avif", "modern image formats"]
  },

  // From AVIF
  {
    slug: "avif-to-jpg",
    from: "AVIF",
    to: "JPG",
    title: "Convert AVIF to JPG",
    description: "Convert modern AVIF images to standard JPG format for universal compatibility with all software and devices.",
    keywords: ["avif to jpg", "convert avif to jpg", "avif to jpeg"]
  },

  // Miscellaneous
  {
    slug: "bmp-to-png",
    from: "BMP",
    to: "PNG",
    title: "Convert BMP to PNG",
    description: "Convert uncompressed BMP images to efficient, lossless PNG format for web use.",
    keywords: ["bmp to png", "convert bmp to png", "bitmap to png"]
  },
  {
    slug: "gif-to-png",
    from: "GIF",
    to: "PNG",
    title: "Convert GIF to PNG",
    description: "Extract the first frame of a GIF and convert it to a high-quality PNG image.",
    keywords: ["gif to png", "convert gif to png", "extract gif frame"]
  }
];

export const groupedConversions = {
  JPG: imageConversions.filter(c => c.from === "JPG"),
  PNG: imageConversions.filter(c => c.from === "PNG"),
  WEBP: imageConversions.filter(c => c.from === "WEBP"),
};
