// renders a funny grid for landing page
export default function Grid({ size }) {
    return (
        <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: size * size }).map((_, i) => (
                <div
                    key={i}
                    className={
                        i % 2 == 0
                            ? "bg-gray-300 h-12 w-12"
                            : "bg-gray-400 h-12 w-12 hover:bg-gray-900 duration-100"
                    }
                ></div>
            ))}
        </div>
    );
}
