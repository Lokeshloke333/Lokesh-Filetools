export interface ImageConversion {
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  keywords: string[];
  features?: string[];
  howToSteps?: string[];
  faqs?: { question: string, answer: string }[];
}

export const imageConversions: ImageConversion[] = [
  // From JPG
  {
    slug: "jpg-to-png",
    from: "JPG",
    to: "PNG",
    title: "Convert JPG to PNG",
    description: "Easily convert your compressed JPG images into lossless PNG format. Essential for graphic design, web development, and preserving maximum visual clarity.",
    keywords: ["jpg to png", "convert jpg to png", "jpeg to png", "image converter", "lossless image"],
    features: [
      "Lossless conversion from JPG data",
      "Creates a solid background baseline",
      "No data uploaded to servers",
      "Instant browser-based processing"
    ],
    howToSteps: [
      "Select the JPG image you want to convert.",
      "Wait a moment while the image is processed locally.",
      "Download the high-quality PNG image."
    ],
    faqs: [
      {
        question: "Does converting JPG to PNG improve quality?",
        answer: "No. JPG is a lossy format, meaning visual data was permanently lost when the image was originally saved. Converting it to PNG will prevent further quality loss during editing, but it cannot restore what was already lost."
      },
      {
        question: "Will the new PNG have a transparent background?",
        answer: "No. Because the original JPG format does not support transparency, the converted PNG will retain whatever background color the JPG had (typically white). If you need to remove the background, try our AI Background Remover tool."
      }
    ]
  },
  {
    slug: "jpg-to-webp",
    from: "JPG",
    to: "WEBP",
    title: "Convert JPG to WEBP",
    description: "Optimize your JPG images by converting them to the next-gen WEBP format. Drastically improve your website's loading speed and Google PageSpeed scores.",
    keywords: ["jpg to webp", "convert jpg to webp", "jpeg to webp", "optimize images", "seo images"],
    features: [
      "Reduces file sizes by up to 34% compared to JPG",
      "Retains high visual fidelity",
      "Fully private local execution",
      "Ideal for modern web development"
    ],
    howToSteps: [
      "Import your large JPG image.",
      "Convert the image into the WEBP format.",
      "Save the optimized file for your website."
    ],
    faqs: [
      {
        question: "Is WEBP really better than JPG?",
        answer: "Yes, for web usage. WEBP was developed by Google specifically for the web and typically achieves 25-34% smaller file sizes than comparable JPGs without a noticeable drop in visual quality."
      },
      {
        question: "Do all browsers support WEBP?",
        answer: "Yes! Modern web browsers including Chrome, Safari, Firefox, and Edge fully support the WEBP image format."
      }
    ]
  },
  {
    slug: "jpg-to-avif",
    from: "JPG",
    to: "AVIF",
    title: "Convert JPG to AVIF",
    description: "Convert standard JPG files into AVIF, the ultimate next-generation image format. Achieve incredible file size savings while maintaining stunning visual fidelity.",
    keywords: ["jpg to avif", "convert jpg to avif", "jpeg to avif", "avif converter", "next gen format"],
    features: [
      "Outperforms both JPG and WEBP compression",
      "Powered by the modern AV1 video codec",
      "Zero server uploads required",
      "Free to use with no limits"
    ],
    howToSteps: [
      "Drag and drop your JPG file.",
      "Initiate the AVIF encoding process.",
      "Download your highly compressed image."
    ],
    faqs: [
      {
        question: "What is AVIF?",
        answer: "AVIF (AV1 Image File Format) is an ultra-modern image format derived from the AV1 video codec. It offers significantly better compression than JPG, PNG, and even WEBP."
      },
      {
        question: "Should I use AVIF for my website?",
        answer: "Yes, if you want the absolute fastest loading speeds. However, be aware that while browser support is growing rapidly, very old browsers may not support AVIF yet."
      }
    ]
  },
  
  // From PNG
  {
    slug: "png-to-jpg",
    from: "PNG",
    to: "JPG",
    title: "Convert PNG to JPG",
    description: "Convert heavy, uncompressed PNG images into lightweight JPG files. Perfect for saving storage space and sharing photos quickly.",
    keywords: ["png to jpg", "convert png to jpg", "png to jpeg", "reduce image size"],
    features: [
      "Massively reduces file sizes for photographs",
      "Automatically flattens transparent backgrounds to white",
      "Fast processing directly in your browser",
      "No registration required"
    ],
    howToSteps: [
      "Upload the large PNG file you want to compress.",
      "Convert it to the universally supported JPG format.",
      "Download the lightweight image."
    ],
    faqs: [
      {
        question: "What happens to the transparent background in my PNG?",
        answer: "JPG does not support transparency. When you convert a PNG to a JPG, any transparent areas will be automatically filled with a solid white background."
      },
      {
        question: "Will the image quality drop?",
        answer: "JPG is a lossy format, so there is technically a slight drop in quality compared to a lossless PNG. However, for photographs and complex images, the difference is usually invisible to the naked eye."
      }
    ]
  },
  {
    slug: "png-to-webp",
    from: "PNG",
    to: "WEBP",
    title: "Convert PNG to WEBP",
    description: "Optimize heavy PNG graphics by converting them to WEBP. Retain full transparency while significantly reducing file size for better web performance.",
    keywords: ["png to webp", "convert png to webp", "transparent webp", "optimize images"],
    features: [
      "Maintains alpha channel transparency",
      "Drastically reduces file size",
      "Private and secure local processing",
      "Improves website SEO performance"
    ],
    howToSteps: [
      "Select your transparent PNG file.",
      "Convert the image to WEBP.",
      "Save the optimized file."
    ],
    faqs: [
      {
        question: "Does WEBP support transparency like PNG?",
        answer: "Yes! Unlike JPG, the WEBP format fully supports alpha channel transparency, making it the perfect lightweight replacement for PNGs on websites."
      },
      {
        question: "How much smaller will the WEBP file be?",
        answer: "On average, a lossless WEBP file is about 26% smaller than a comparable PNG file. Lossy WEBP files can be up to 70% smaller."
      }
    ]
  },
  {
    slug: "png-to-avif",
    from: "PNG",
    to: "AVIF",
    title: "Convert PNG to AVIF",
    description: "Convert your PNG files to AVIF for the absolute best-in-class file size savings. Maintain transparency and crisp edges at a fraction of the original size.",
    keywords: ["png to avif", "convert png to avif", "avif format", "image compression"],
    features: [
      "Industry-leading compression ratio",
      "Full support for transparent backgrounds",
      "Zero data uploaded to cloud servers",
      "Fast execution via WebAssembly"
    ],
    howToSteps: [
      "Import your large PNG graphic.",
      "Start the AVIF encoding process.",
      "Download the highly compressed, modern image."
    ],
    faqs: [
      {
        question: "Is AVIF better than WEBP for replacing PNGs?",
        answer: "Generally, yes. AVIF provides better compression algorithms than WEBP, resulting in smaller file sizes at the same visual quality. Both formats support transparency."
      },
      {
        question: "Why does AVIF encoding take slightly longer?",
        answer: "AVIF uses the highly advanced AV1 codec, which requires more computational power to compress the image compared to older formats."
      }
    ]
  },

  // From WEBP
  {
    slug: "webp-to-jpg",
    from: "WEBP",
    to: "JPG",
    title: "Convert WEBP to JPG",
    description: "Convert WEBP images back to standard JPG format. Ensure maximum compatibility across legacy devices, outdated software, and strict upload forms.",
    keywords: ["webp to jpg", "convert webp to jpg", "webp to jpeg", "image converter"],
    features: [
      "Fixes compatibility issues instantly",
      "Flattens transparency to a solid background",
      "Private local browser execution",
      "Free with no hidden limits"
    ],
    howToSteps: [
      "Select the WEBP image you downloaded from the web.",
      "Convert it to the universally recognized JPG format.",
      "Save the JPG to your device."
    ],
    faqs: [
      {
        question: "Why would I convert WEBP to JPG?",
        answer: "While WEBP is fantastic for websites, some older desktop software, older smartphones, and specific online upload forms (like government or school portals) only accept standard JPG files."
      },
      {
        question: "What happens if the WEBP was transparent?",
        answer: "Because JPG does not support transparency, any transparent areas in the WEBP will be filled with a solid white background during the conversion."
      }
    ]
  },
  {
    slug: "webp-to-png",
    from: "WEBP",
    to: "PNG",
    title: "Convert WEBP to PNG",
    description: "Convert WEBP images to lossless PNG format to edit them in traditional graphic design software while keeping transparent backgrounds intact.",
    keywords: ["webp to png", "convert webp to png", "transparent png"],
    features: [
      "Preserves original alpha channel transparency",
      "Lossless conversion format",
      "Zero server uploads required",
      "Uncapped file size limit"
    ],
    howToSteps: [
      "Drop your WEBP file into the tool.",
      "Convert the image into the lossless PNG format.",
      "Download your design-ready graphic."
    ],
    faqs: [
      {
        question: "Will I lose transparency when converting to PNG?",
        answer: "No. Both WEBP and PNG fully support transparency. The transparent areas of your image will be perfectly preserved."
      },
      {
        question: "Will the file size increase?",
        answer: "Yes. PNG uses older, less efficient compression algorithms than WEBP, so the resulting PNG file will likely be larger than the original WEBP file."
      }
    ]
  },
  {
    slug: "webp-to-avif",
    from: "WEBP",
    to: "AVIF",
    title: "Convert WEBP to AVIF",
    description: "Upgrade your WEBP images to AVIF for even better compression and modern web performance. Squeeze every last byte out of your image assets.",
    keywords: ["webp to avif", "convert webp to avif", "modern image formats"],
    features: [
      "Upgrades to the modern AV1 image codec",
      "Retains transparency (if present)",
      "Processed locally in your browser",
      "No registration required"
    ],
    howToSteps: [
      "Upload your WEBP image.",
      "Re-encode the image into AVIF.",
      "Download the highly optimized file."
    ],
    faqs: [
      {
        question: "Is there a significant difference between WEBP and AVIF?",
        answer: "Yes, AVIF generally offers around 30% better compression than WEBP at similar quality levels, making it the new standard for web performance."
      }
    ]
  },

  // From AVIF
  {
    slug: "avif-to-jpg",
    from: "AVIF",
    to: "JPG",
    title: "Convert AVIF to JPG",
    description: "Convert ultra-modern AVIF images into standard JPG format. Resolve frustrating compatibility issues when trying to view or edit AVIF files.",
    keywords: ["avif to jpg", "convert avif to jpg", "avif to jpeg"],
    features: [
      "Fixes software compatibility issues",
      "Fast local processing",
      "No data uploaded to servers",
      "100% free to use"
    ],
    howToSteps: [
      "Select the unopenable AVIF image.",
      "Convert it into the universally supported JPG format.",
      "Download your readable image file."
    ],
    faqs: [
      {
        question: "Why can't I open my AVIF file?",
        answer: "AVIF is a very new format. While web browsers support it, many older desktop image viewers and graphic design software applications have not yet updated to support it. Converting to JPG solves this instantly."
      }
    ]
  },

  // Miscellaneous
  {
    slug: "bmp-to-png",
    from: "BMP",
    to: "PNG",
    title: "Convert BMP to PNG",
    description: "Convert massive, uncompressed BMP images into efficient, lossless PNG format for web use and easier sharing.",
    keywords: ["bmp to png", "convert bmp to png", "bitmap to png"],
    features: [
      "Massively reduces file size losslessly",
      "Perfect for preserving pixel art",
      "Private browser-based execution",
      "No file limits"
    ],
    howToSteps: [
      "Import your large BMP file.",
      "Convert it to the compressed PNG format.",
      "Download the optimized image."
    ],
    faqs: [
      {
        question: "Will converting BMP to PNG reduce quality?",
        answer: "No. PNG is a lossless format just like BMP. It will perfectly preserve every pixel of the original image, but it uses compression to make the file size much smaller."
      }
    ]
  },
  {
    slug: "gif-to-png",
    from: "GIF",
    to: "PNG",
    title: "Convert GIF to PNG",
    description: "Extract the first frame of an animated GIF and convert it into a static, high-quality PNG image.",
    keywords: ["gif to png", "convert gif to png", "extract gif frame"],
    features: [
      "Extracts static image from animation",
      "Preserves original transparency",
      "100% private and secure",
      "Lightning fast execution"
    ],
    howToSteps: [
      "Upload your animated GIF.",
      "Extract the frame to PNG.",
      "Download the static image."
    ],
    faqs: [
      {
        question: "Will the resulting PNG be animated?",
        answer: "No. The PNG format does not support animation. This tool will extract the first frame of the GIF and save it as a high-quality static image."
      }
    ]
  }
];

export const groupedConversions = {
  JPG: imageConversions.filter(c => c.from === "JPG"),
  PNG: imageConversions.filter(c => c.from === "PNG"),
  WEBP: imageConversions.filter(c => c.from === "WEBP"),
};
