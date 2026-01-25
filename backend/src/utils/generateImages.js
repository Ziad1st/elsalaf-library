const path = require("path");
const { createCanvas, registerFont } = require("canvas");


const fontsPath = path.join(process.cwd(), "fonts");

try {
    registerFont(path.join(__dirname,"..","..","fonts","Amiri-Regular.ttf"), { family: "Amiri", weight: "normal" });
    registerFont(path.join(__dirname,"..","..","fonts","Amiri-Bold.ttf"), { family: "Amiri", weight: "bold" });
} catch (err) {
    console.error("Failed to register fonts:", err);
}


function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function drawIslamicPattern(ctx, width, height, color) {
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const size = 60;
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      ctx.beginPath();
      ctx.moveTo(x, y + size / 2);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size / 2);
      ctx.lineTo(x + size / 2, y + size);
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawDivider(ctx, x, y, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x - 20, y);
  ctx.moveTo(x + 20, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawRTLText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line.trim());

  ctx.save();
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + i * lineHeight);
  });

  ctx.restore();
}

const formatAuthorName = (author) => {
  const words = author.split(" ");

  // إذا كان الاسم قصيراً أصلاً، أرجعه كما هو
  if (words.length <= 6) return author;

  // فحص الكلمة السابعة (index 6)
  const connectors = [
    "بن",
    "ابن",
    "إبن",
    "عبد",
    "نور",
    "تقي",
    "علاء",
    "سراج",
    "بهاء",
  ];

  // إذا كانت الكلمة السادسة أو السابعة "بن"، يفضل أن نأخذ حتى الكلمة الثامنة لضبط النسب
  if (connectors.includes(words[5]) || connectors.includes(words[6])) {
    return words.slice(0, 8).join(" ");
  }

  // الوضع الافتراضي قطع عند الكلمة السادسة
  return words.slice(0, 6).join(" ");
};

const generateUserImage = (fullName) => {
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // تنظيف الاسم + أخذ أول اسمين فقط
  const names = fullName.trim().split(" ").slice(0, 2);
  const displayName = names.join(" ");

  // ألوان ثابتة حسب الاسم
  const colors = [
    ["#0f172a", "#2563eb"],
    ["#064e3b", "#10b981"],
    ["#1e1b4b", "#6366f1"],
    ["#3f1d38", "#db2777"],
    ["#312e81", "#38bdf8"],
  ];

  const charSum = displayName
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const selected = colors[charSum % colors.length];

  // خلفية Gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, selected[0]);
  gradient.addColorStop(1, selected[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // زخرفة دائرية خفيفة
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(size - 50, 50, 120, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 1;

  // النص
  ctx.font = "bold 40px Amiri";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 10;

  ctx.fillText(displayName, size / 2, size / 2);

  return canvas.toDataURL("image/png");
};

const generateBookCover = (bookTitle, author, publisher = "دار النشر") => {
  const width = 600;
  const height = 900;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ألوان فاخرة
  const palettes = [
    // Classic Islamic
    ["#0b1d26", "#d4af37"],
    ["#102a43", "#f6c453"],
    ["#1b263b", "#e0b973"],

    // Heritage Green
    ["#0f2f2f", "#bfa76f"],
    ["#12372a", "#d1b36f"],
    ["#1c3d2e", "#f3d08b"],

    // Manuscript Brown
    ["#2a1e17", "#c7a45d"],
    ["#3b2f2f", "#e5c07b"],
    ["#362417", "#f1d4a4"],

    // Royal Purple
    ["#1e1b3a", "#c4b5fd"],
    ["#2e1065", "#facc15"],

    // Academic Gray
    ["#111827", "#9ca3af"],
    ["#1f2933", "#d1d5db"],
  ];

  const selected = palettes[Math.floor(Math.random() * palettes.length)];

  // خلفية
  ctx.fillStyle = selected[0];
  ctx.fillRect(0, 0, width, height);

  // زخرفة إسلامية بسيطة
  drawIslamicPattern(ctx, width, height, selected[1]);

  // إطار داخلي
  ctx.strokeStyle = selected[1];
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // عنوان الكتاب
  ctx.font = "bold 64px Amiri";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  drawRTLText(ctx, bookTitle, canvas.width / 2, 300, canvas.width - 160, 80);

  // خط فاصل
  drawDivider(ctx, width / 2, 420, 220, selected[1]);

  // اسم المؤلف
  ctx.font = "bold 24px Amiri";
  ctx.fillText(formatAuthorName(author), width / 2, height - 170);

  // اسم الدار
  ctx.font = "bold 20px 'Amiri', 'Cairo', 'FreeSans', serif";
  ctx.globalAlpha = 0.8;
  ctx.fillText(publisher, width / 2, height - 80);
  ctx.globalAlpha = 1;

  return canvas.toDataURL("image/png");
};

module.exports = { generateUserImage, generateBookCover };









