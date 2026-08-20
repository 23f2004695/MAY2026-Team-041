"""Shared chat-model factory for every feature that calls the configured LLM backend.

LLM_MODE (set in .env):
  openai  -> ChatOpenAI (gpt-4o-mini or OPENAI_MODEL)
  bedrock -> ChatBedrockConverse (amazon.nova-lite-v1:0 or BEDROCK_MODEL_ID)
  ollama  -> ChatOllama (llama3.2:3b or OLLAMA_MODEL)

Pulled out of chat/orchestrator.py once a second feature (books/service.py's
suggest_description) needed the same provider-selection logic — one place to add a
provider or change a default, instead of two copies drifting apart.
"""

from __future__ import annotations

from typing import Any

from langchain_core.language_models import BaseChatModel
from pydantic import SecretStr

from app.core.config import get_settings


def build_chat_llm() -> BaseChatModel:
    s = get_settings()
    mode = s.llm_mode.lower()

    if mode == "bedrock":
        from langchain_aws import ChatBedrockConverse

        kwargs: dict[str, Any] = {"model_id": s.bedrock_model_id, "region_name": s.aws_region}
        if s.aws_access_key_id and s.aws_secret_access_key:
            kwargs["aws_access_key_id"] = s.aws_access_key_id
            kwargs["aws_secret_access_key"] = s.aws_secret_access_key
        return ChatBedrockConverse(**kwargs)

    if mode == "ollama":
        from langchain_ollama import ChatOllama

        return ChatOllama(model=s.ollama_model, base_url=s.ollama_base_url)

    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model=s.openai_model,
        api_key=SecretStr(s.openai_api_key),
        temperature=0.3,
    )
