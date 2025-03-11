import uvicorn
from fastapi import FastAPI
from model import SafeFrom, database

app = FastAPI(root_path="/api")

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/safety/applications")
async def applications(safefrom: SafeFrom):
    
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=5000, log_level="debug")
