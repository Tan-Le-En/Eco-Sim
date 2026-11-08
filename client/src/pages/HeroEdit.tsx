import { Link } from "wouter";

export default function HeroEdit() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold">
          Hidden Hero Editor
        </h1>
        <p className="text-muted-foreground mt-2">Route: /__hero-edit</p>
        <Link href="/" className="mt-4 inline-block text-vermilion underline">
          Back home
        </Link>
      </div>
    </div>
  );
}
