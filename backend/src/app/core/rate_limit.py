from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import get_settings

# Disabled in tests — the test client reuses a single IP across many requests per
# module, so a request-count limit keyed by IP would produce spurious 429s instead of
# testing anything real.
limiter = Limiter(key_func=get_remote_address, enabled=get_settings().app_env != "test")
