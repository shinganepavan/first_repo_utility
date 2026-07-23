from pydantic import BaseModel

class AIGenerationRequest(BaseModel):
    tool_id: str
    prompt: str

class AIGenerationResponse(BaseModel):
    response: str
    tool_id: str
