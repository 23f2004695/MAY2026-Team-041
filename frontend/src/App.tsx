import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

type ApiState = 'checking' | 'ready' | 'unavailable';

export function App() {
  const [apiState, setApiState] = useState<ApiState>('checking');

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        const response = await fetch(`${apiUrl}/health/live`, {
          signal: controller.signal,
        });
        setApiState(response.ok ? 'ready' : 'unavailable');
      } catch {
        if (!controller.signal.aborted) {
          setApiState('unavailable');
        }
      }
    }

    void checkApi();

    return () => controller.abort();
  }, []);

  return (
    <main className="app-shell">
      <section className="status-panel" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">MAY2026 Team 041</p>
          <h1 id="app-title">Full-stack app scaffold</h1>
          <p className="summary">
            React, FastAPI, Prisma, PostgreSQL, uv, and Playwright are wired for local development
            and ready to grow into product code.
          </p>
        </div>

        <dl className="status-grid">
          <div>
            <dt>Frontend</dt>
            <dd>React + Vite</dd>
          </div>
          <div>
            <dt>Backend</dt>
            <dd>FastAPI</dd>
          </div>
          <div>
            <dt>Database</dt>
            <dd>PostgreSQL + Prisma</dd>
          </div>
          <div>
            <dt>API</dt>
            <dd className={`api-state api-state--${apiState}`}>{apiState}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
