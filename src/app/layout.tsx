import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "./globals.css";
import { site } from "@/content";

export const metadata: Metadata = {
  title: `${site.company} · ${site.slogan}`,
  description:
    `${site.company} builds autonomous rovers and robotic manipulators for logistics. ` +
    `Featured project: ${site.product}, a rugged 4WD ROS 2 mobile robot platform.`,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
