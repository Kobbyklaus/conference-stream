import JoinRoom from "@/components/JoinRoom";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Conference Stream</h1>
        <p className="text-gray-400">
          Join online conferences and watch together in real-time
        </p>
      </div>

      <div className="w-full max-w-sm">
        <JoinRoom />

        <div className="text-center mt-6">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
          >
            Host a Conference &rarr;
          </a>
        </div>
      </div>
    </main>
  );
}
