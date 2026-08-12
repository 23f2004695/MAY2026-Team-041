from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import get_settings

# Disabled only in isolated test/E2E environments. E2E still uses the real database
# lifecycle, but its browser workers share one loopback address and would otherwise
# trip the production brute-force limit while exercising unrelated pages.
limiter = Limiter(
    key_func=get_remote_address,
    enabled=get_settings().app_env not in {"test", "e2e"},
)
