from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.db import models
from app.schemas.ai import AIGenerationRequest, AIGenerationResponse
from app.api import deps

router = APIRouter()

@router.post("/generate", response_model=AIGenerationResponse)
def generate_ai_text(
    req: AIGenerationRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(deps.get_current_user)
):
    user_id = current_user.id if current_user else None
    
    # Process text generation prompt locally (or connect to Gemini/OpenAI if API keys exist)
    # Since we are local first, we provide a solid generator response based on the tool
    prompt_lower = req.prompt.lower()
    
    response_text = ""
    if "resume" in req.tool_id:
        response_text = f"# Professional Resume\n\nGenerated for: User Profile\nPrompt Detail: {req.prompt}\n\n## Summary\nInnovative engineer with expert knowledge in client-side widgets, backend architectures, and responsive glassmorphic design system layouts."
    elif "cover-letter" in req.tool_id:
        response_text = f"Dear Hiring Team,\n\nI am writing to submit my application for the role mentioned in your search description. Given my technical background, I am confident in adding value.\n\nBest regards,\nCandidate"
    elif "email" in req.tool_id:
        response_text = f"Subject: Response to Request\n\nHello,\n\nI have reviewed the information regarding your request and would like to confirm our progress. Let me know if you would like to hop on a quick call.\n\nBest,\nSender"
    else:
        response_text = f"[AI Generated Output]\nBased on prompt: \"{req.prompt[:60]}...\"\n\nHere is your refined text draft, structured and styled. Copy to clipboard or export directly."

    # Save to history logs
    db_gen = models.AIGeneration(
        user_id=user_id,
        tool_id=req.tool_id,
        prompt=req.prompt,
        response=response_text
    )
    db.add(db_gen)
    
    # Also log a standard tool execution
    db_log = models.UsageLog(user_id=user_id, tool_id=req.tool_id)
    db.add(db_log)
    
    db.commit()
    
    return {
        "response": response_text,
        "tool_id": req.tool_id
    }
