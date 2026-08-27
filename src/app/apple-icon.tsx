import { ImageResponse } from "next/og";
import BrandMark from "@/components/BrandMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#facc15",
        }}
      >
        <BrandMark size={110} color="#0f172a" />
      </div>
    ),
    size,
  );
}
