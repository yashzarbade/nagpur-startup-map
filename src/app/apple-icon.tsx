import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "40px",
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          CIT
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, marginTop: 4, opacity: 0.9 }}>
          CENTRAL INDIA
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
