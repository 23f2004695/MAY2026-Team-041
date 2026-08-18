import subprocess
import os
import sys

try:
    # Start PostgreSQL and Redis (rate limiting + chat history both need Redis up)
    subprocess.run(
        ["docker", "compose", "up", "-d", "--wait", "db", "redis"],
        check=True,
    )

    # Move to the backend directory
    os.chdir("backend")

    # Migrations are applied by the app itself on startup (see app.main's
    # _apply_pending_migrations, gated by AUTO_MIGRATE) — running `prisma migrate
    # deploy` here too was pure redundancy: same check, twice, on every boot.

    # Start the FastAPI server
    subprocess.run(
        [
            "uv",
            "run",
            "uvicorn",
            "app.main:app",
            "--app-dir",
            "src",
            "--reload",
            "--host",
            "127.0.0.1",
            "--port",
            "8000",
        ],
        check=True,
    )

except FileNotFoundError as e:
    print(f"\n❌ Required command not found: {e.filename}")
    print("Make sure Docker and uv are installed and available in your PATH.")
    sys.exit(1)

except subprocess.CalledProcessError as e:
    print(f"\n❌ Command failed with exit code {e.returncode}.")
    sys.exit(e.returncode)

except KeyboardInterrupt:
    print("\n🛑 Backend stopped.")