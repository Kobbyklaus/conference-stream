import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Conference Stream</h1>
        <p className="text-gray-400">
          Host online conferences and watch together in real-time
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <CreateRoom />
        <JoinRoom />
      </div>
    </main>
  );
}
