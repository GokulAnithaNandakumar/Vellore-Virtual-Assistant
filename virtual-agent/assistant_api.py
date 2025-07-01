from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from vellore_assistant import rag_chain, filter_query
import uvicorn

app = FastAPI()

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    user_input = data.get('message', '')
    filtered = filter_query(user_input)
    answer = rag_chain.invoke({"question": filtered})
    return JSONResponse({"answer": answer})

if __name__ == "__main__":
    uvicorn.run("assistant_api:app", host="0.0.0.0", port=5001, reload=True)
