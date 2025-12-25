import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-white/70">The page you're looking for doesn't exist.</p>
      <div className="mt-6">
        <Link href="/" className="underline">Go home</Link>
      </div>
    </div>
  );
}
