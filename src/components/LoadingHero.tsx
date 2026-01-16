export function LoadingHero() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-100 p-4">
            <div className="card w-full max-w-2xl bg-base-200 shadow-xl">
                <div className="card-body items-center text-center gap-4 py-16">
                    <h2 className="card-title text-5xl font-bold mb-5">GraphVM</h2>
                    <p className="animate-pulse">Loading...</p>
                    <span className="loading loading-spinner loading-xl" />
                </div>
            </div>
        </div>
    );
}
