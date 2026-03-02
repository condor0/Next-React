import "./globals.css";
import { Providers } from "./providers";

const metadata = {
  title: "Research Workspace",
  description: "Field notes and project management",
};

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
