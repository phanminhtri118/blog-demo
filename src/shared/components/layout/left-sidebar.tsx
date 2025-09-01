import { Home, Code, ShoppingBag, BookOpen, Mic, Tag, Github, Twitter, Twitch } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { icon: <Home />, text: "Home", href: "/" },
  { icon: <Code />, text: "Code of Conduct", href: "/code-of-conduct" },
  { icon: <ShoppingBag />, text: "Shop", href: "/shop" },
  { icon: <BookOpen />, text: "About", href: "/about" },
  { icon: <Mic />, text: "Contact", href: "/contact" },
];

const tagLinks = [
  { text: "#react", href: "/t/react" },
  { text: "#nextjs", href: "/t/nextjs" },
  { text: "#javascript", href: "/t/javascript" },
  { text: "#typescript", href: "/t/typescript" },
  { text: "#css", href: "/t/css" },
];

const socialLinks = [
  { icon: <Twitter />, href: "#" },
  { icon: <Github />, href: "#" },
  { icon: <Twitch />, href: "#" },
];

export const LeftSidebar = () => {
  return (
    <aside className="hidden md:block w-60 shrink-0 py-4 pr-4">
      <div className="sticky top-20 flex flex-col gap-4">
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              {link.icon}
              <span>{link.text}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Tag className="h-5 w-5" /> Tags
          </h3>
          <div className="flex flex-col gap-1">
            {tagLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
