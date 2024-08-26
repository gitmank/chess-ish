export default function Loading() {
    return (
        <div className="flex flex-col space-y-16 justify-center items-center h-screen">
            <h1 className="text-4xl font-bold">Loading ⏳</h1>
            <a
                href="/"
                className="btn rounded-full p-1 px-2 bg-blue-400 hover:bg-blue-500 duration-75"
            >
                Return Home
            </a>
        </div>
    );
}
