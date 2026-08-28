import { ImageResponse } from "next/og";
import BrandMark from "@/components/BrandMark";
import { SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#facc15",
            }}
          >
            <BrandMark size={50} color="#0f172a" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>BE POSITIVE</span>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#facc15", lineHeight: 1.1 }}>NEWS</span>
          </div>
        </div>
        <p style={{ fontSize: 30, maxWidth: 900, marginTop: 40, color: "#dbeafe" }}>{SITE_DESCRIPTION}</p>
      </div>
    ),
    size,
  );
}
