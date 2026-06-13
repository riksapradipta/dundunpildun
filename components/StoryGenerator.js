"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { WC2026_TEAMS } from "@/lib/teams";

const TEAM_MAP = Object.fromEntries(WC2026_TEAMS.map((t) => [t.slug, t]));

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function StoryGenerator({ friend, color, teams }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const hex = color?.hex || "#10b981";
      const W = 1080;
      const H = 1920;

      const qrDataUrl = await QRCode.toDataURL("https://riksapradipta.github.io/dundunpildun", {
        width: 320,
        margin: 2,
        color: { dark: "#111827", light: "#ffffff" },
      });

      const qrImg = await new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = qrDataUrl;
      });

      // Preload team images for teams with flagImg
      const imgCache = {};
      for (const slug of teams) {
        const team = TEAM_MAP[slug];
        if (team?.flagImg) {
          const img = await new Promise((res, rej) => {
            const i = new Image();
            i.onload = () => res(i);
            i.onerror = rej;
            i.src = team.flagImg;
          });
          imgCache[slug] = img;
        }
      }

      await document.fonts.ready;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      const font = "'Geist', 'SF Pro Display', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif";

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.35, "#1e293b");
      grad.addColorStop(0.65, hexToRgba(hex, 0.13));
      grad.addColorStop(1, "#ffffff");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Accent stripe
      const stripe = ctx.createLinearGradient(0, 0, W, 0);
      stripe.addColorStop(0, hex);
      stripe.addColorStop(0.5, "rgba(255,255,255,0.5)");
      stripe.addColorStop(1, hex);
      ctx.fillStyle = stripe;
      ctx.fillRect(0, 0, W, 8);

      // Avatar circle — left side
      const avatarCX = 140;
      const avatarCY = 150;
      const avatarR = 60;
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCX, avatarCY, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = hex;
      ctx.shadowColor = hexToRgba(hex, 0.4);
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.restore();

      // Initial letter
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 50px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(friend.charAt(0).toUpperCase(), avatarCX, avatarCY);

      // Friend name — right of avatar
      const nameX = 230;
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 48px ${font}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(friend, nameX, 145);

      // Subtitle
      ctx.fillStyle = "#94a3b8";
      ctx.font = `26px ${font}`;
      ctx.fillText("mendukung sepenuh hati", nameX, 205);

      // Teams grid — no box, big flags
      const teamsPerRow = 3;
      const cardW = 320;
      const gapX = 16;
      const gapY = 10;
      const gridStartY = 290;
      const qrSize = 220;
      const qrPad = 20;
      const qrMargin = 40;
      const qrTotal = qrSize + qrPad * 2;
      const qrGap = 80;
      const bottomReserved = qrTotal + qrGap + 40;

      const numRows = Math.ceil(teams.length / teamsPerRow);
      const availableH = H - gridStartY - bottomReserved;
      const totalGaps = Math.max(0, numRows - 1) * gapY;
      const cardH = Math.min(180, Math.max(80, Math.floor((availableH - totalGaps) / numRows)));

      const flagSize = Math.min(100, Math.floor(cardH * 0.65));
      const nameSize = Math.min(16, Math.max(11, Math.floor(cardH * 0.1)));
      const flagY = cardH * 0.32;
      const nameY = cardH * 0.75;

      const rows = [];
      for (let i = 0; i < teams.length; i += teamsPerRow) {
        rows.push(teams.slice(i, i + teamsPerRow));
      }

      let currentY = gridStartY;
      for (const row of rows) {
        const totalRowW = row.length * cardW + (row.length - 1) * gapX;
        const startX = (W - totalRowW) / 2;

        for (let ci = 0; ci < row.length; ci++) {
          const slug = row[ci];
          const team = TEAM_MAP[slug];
          const cx = startX + ci * (cardW + gapX);

          if (imgCache[slug]) {
            const img = imgCache[slug];
            const s = flagSize;
            ctx.drawImage(img, cx + cardW / 2 - s / 2, currentY + flagY - s / 2, s, s);
          } else {
            ctx.font = `${flagSize}px ${font}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(team.flag, cx + cardW / 2, currentY + flagY);
          }

          ctx.fillStyle = "#e2e8f0";
          ctx.font = `bold ${nameSize}px ${font}`;
          ctx.fillText(team.name, cx + cardW / 2, currentY + nameY);
        }

        currentY += cardH + gapY;
      }

      // QR code section — bottom right, below grid
      // Ensure QR stays fixed to bottom-right regardless of grid size
      const gridEndY = gridStartY + rows.length * cardH + Math.max(0, rows.length - 1) * gapY;
      const qrX = W - qrTotal - qrMargin;
      const qrY = H - qrTotal - qrMargin; // fixed bottom-right

      ctx.save();
      roundRect(ctx, qrX, qrY, qrTotal, qrTotal, 14);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();

      ctx.drawImage(qrImg, qrX + qrPad, qrY + qrPad, qrSize, qrSize);

      const textX = qrX - 30;
      const textCenterY = qrY + qrTotal / 2;
      ctx.fillStyle = "#ffc619";
      ctx.font = `bold 40px ${font}`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      // darker orange outline
      ctx.lineWidth = 6;
      ctx.shadowColor = hexToRgba("#ffb14a", 0.35);
      ctx.shadowBlur = 8;
      ctx.strokeText("Scan", textX, textCenterY - 30);
      ctx.strokeText("untuk bikin juga", textX, textCenterY + 30);
      // fill on top
      ctx.shadowBlur = 0;
      ctx.fillText("Scan", textX, textCenterY - 30);
      ctx.fillText("untuk bikin juga", textX, textCenterY + 30);

      // Branding
      ctx.fillStyle = "#475569";
      ctx.font = `bold 24px ${font}`;
      ctx.textAlign = "left";
      ctx.fillText("\u{1F3C6}  dundunpildun", 50, H - 60);

      // Export
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `dundunpildun-${friend.replace(/\s+/g, "-")}.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Story generation failed:", err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-orange-700 transition hover:bg-orange-100 hover:border-orange-300 active:scale-95 disabled:opacity-50 touch-manipulation"
    >
      {loading ? "Membuat..." : "Bagikan"}
    </button>
  );
}
