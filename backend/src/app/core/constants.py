from enum import StrEnum


class Role(StrEnum):
    """Canonical role names stored in the database and exposed by the API.

    ``IT_HEAD`` is the Python identifier; ``"it-head"`` remains its serialized
    value because hyphens are valid in URLs/JSON strings but not identifiers.
    """

    ADMIN = "admin"
    LIBRARIAN = "librarian"
    MANAGER = "manager"
    MEMBER = "member"
    GUARDIAN = "guardian"
    IT_HEAD = "it-head"
