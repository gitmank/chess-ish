export default function Redirect({ to = "/" }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center space-y-12 p-12 text-center">
            <h1 className="text-4xl font-bold">👋 Hiee</h1>
            <p className="text-xl">You are being redirected to {to}</p>
            <a
                href={`${to}`}
                className="btn rounded-full p-1 px-2 bg-blue-400 hover:bg-blue-500 duration-75"
            >
                Go to {to === "/" ? "Home" : to}
            </a>
        </main>
    );
}
