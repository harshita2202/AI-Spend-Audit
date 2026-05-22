import { Link } from "wouter";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-black">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link href="/" className="text-primary underline">Go home</Link>
    </div>
  );
}