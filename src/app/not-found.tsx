import Link from "next/link";
import Container from "@/shared/ui/Container/Container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="max-w-2xl rounded-[var(--radius-xl)] border border-line bg-surface p-10 shadow-soft">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="text-4xl font-bold text-text">Страница не найдена</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Возможно, раздел ещё не перенесён в новую структуру сайта.
        </p>
        <Link className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white" href="/">
          На главную
        </Link>
      </div>
    </Container>
  );
}
