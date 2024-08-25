// links
const links = [
    { href: "/login", label: "Login" },
    { href: "/rules", label: "Rules" },
];

// renders simple navbar with links
export default function Navbar() {
    return (
        <nav className="flex space-x-4">
            {links.map(({ href, label }) => (
                <a
                    key={href}
                    href={href}
                    className="btn rounded-full p-1 px-2 hover:bg-blue-400 duration-75"
                >
                    {label}
                </a>
            ))}
        </nav>
    );
}
