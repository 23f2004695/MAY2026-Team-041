from datetime import UTC, datetime

from prisma.models import Book

from app.db.prisma import prisma


async def find_by_id(book_id: str) -> Book | None:
    return await prisma.book.find_unique(where={"id": book_id})


async def find_by_isbn(isbn: str) -> Book | None:
    return await prisma.book.find_unique(where={"isbn": isbn})


async def list_books(
    *, search: str | None, category: str | None, page: int, page_size: int
) -> tuple[list[Book], int]:
    where: dict = {"deletedAt": None}
    if search:
        where["OR"] = [
            {"title": {"contains": search, "mode": "insensitive"}},
            {"author": {"contains": search, "mode": "insensitive"}},
            {"description": {"contains": search, "mode": "insensitive"}},
        ]
    if category and category.lower() != "all":
        where["category"] = category

    total = await prisma.book.count(where=where)
    items = await prisma.book.find_many(
        where=where,
        order={"createdAt": "desc"},
        skip=(page - 1) * page_size,
        take=page_size,
    )
    return items, total


async def create_book(data: dict) -> Book:
    return await prisma.book.create(data=data)


async def update_book(book_id: str, data: dict) -> Book:
    return await prisma.book.update(where={"id": book_id}, data=data)


async def soft_delete_book(book_id: str) -> Book:
    return await prisma.book.update(where={"id": book_id}, data={"deletedAt": datetime.now(UTC)})
