import "../styles/globals.css";
import "../styles/satoshi.css";
import "../styles/plushjakarta.css";
import { Plus_Jakarta_Sans } from "next/font/google";
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${plusJakartaSans.className} flex min-h-screen flex-col dark:bg-[#151F34]`}
      >
        {children}
      </body>
    </html>
  );
};

export default layout;
