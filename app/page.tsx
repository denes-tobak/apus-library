import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("test_connection")
    .select("*");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <pre>
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}