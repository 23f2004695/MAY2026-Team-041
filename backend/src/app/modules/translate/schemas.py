from pydantic import BaseModel, Field, field_validator


class TranslateRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    target_lang: str = Field(min_length=2, max_length=10)
    source_lang: str = "auto"


class TranslateResponse(BaseModel):
    translated: str


class TranslateBatchRequest(BaseModel):
    texts: list[str] = Field(min_length=1, max_length=100)
    target_lang: str = Field(min_length=2, max_length=10)
    source_lang: str = "auto"

    @field_validator("texts")
    @classmethod
    def _validate_total_size(cls, texts: list[str]) -> list[str]:
        if any(not text or len(text) > 5000 for text in texts):
            raise ValueError("Each text must contain between 1 and 5000 characters")
        if sum(len(text) for text in texts) > 20_000:
            raise ValueError("Batch text is limited to 20000 characters")
        return texts


class TranslateBatchResponse(BaseModel):
    translated: list[str]
