import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import SafeFrom, database

app = FastAPI(root_path="/api")
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:5000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 用户登录
@app.get("/safety/user/{user_id}")
async def login_user(user_id: str):
    return {"message": "successes"}

# 提交申请
@app.post("/safety/submit")
async def applications(safefrom: SafeFrom):
    return {"message": "successes"}

# 获取历史记录
@app.get("/safety/applications/{user_id}")
async def root(user_id: str):
    return []


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=5000, log_level="debug")
