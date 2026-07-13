export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-lg bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-bold">
          📚 Apus Library
        </h1>

        <div className="mt-6 space-y-2">
          <p>
            Supabase URL:
          </p>

          <p className="text-green-600">
            {process.env.NEXT_PUBLIC_SUPABASE_URL
              ? "✅ Loaded"
              : "❌ Missing"}
          </p>

          <p>
            Anon Key:
          </p>

          <p className="text-green-600">
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? "✅ Loaded"
              : "❌ Missing"}
          </p>
        </div>
      </div>
    </main>
  );
}