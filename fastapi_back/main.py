import uvicorn
import queue
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from peewee import JOIN
from model import create_tables, SafeForm, SafeFormHead, workLocation, dangerTypes, accompaningPersons

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
async def applications(safefrom: SafeForm):
    temp_head = SafeFormHead()
    temp_head.applicationNumber = safefrom.applicationNumber
    temp_head.name = safefrom.name
    temp_head.idNumber = safefrom.idNumber
    temp_head.companyName = safefrom.companyName
    temp_head.phoneNumber = safefrom.phoneNumber
    temp_head.submitTime = safefrom.submitTime
    temp_head.startDate = safefrom.startDate
    temp_head.startTime = safefrom.startTime
    temp_head.workingHours = safefrom.workingHours
    temp_head.workType = safefrom.workType
    temp_head.isProductWork = safefrom.isProductWork
    temp_head.projectName = safefrom.projectName
    temp_head.vehicleNumber = safefrom.vehicleNumber
    temp_head.trackPosition = safefrom.trackPosition
    temp_head.workContent = safefrom.workContent
    temp_head.workBasis = safefrom.workBasis
    temp_head.basisNumber = safefrom.basisNumber
    temp_head.isDangerousWork = safefrom.isDangerousWork
    temp_head.notifierName = safefrom.notifierName
    temp_head.notifierNumber = safefrom.notifierNumber
    temp_head.notifierDepartment = safefrom.notifierDepartment
    temp_head.accompaningCount = safefrom.accompaningCount
    temp_head.insert()
    
    for ch in safefrom.workLocation:
        temp_work = workLocation()
        temp_work.formApplicationNumber = safefrom.applicationNumber
        temp_work.workLocation = ch
        temp_work.insert()
        
    for ch in safefrom.dangerTypes:
        temp_danger = dangerTypes()
        temp_danger.formApplicationNumber = safefrom.applicationNumber
        temp_danger.dangerTypes = ch
        temp_danger.insert()
        
    for ch in safefrom.accompaningPersons:
        temp_person = accompaningPersons()
        temp_person.formApplicationNumber = safefrom.applicationNumber
        temp_person.name = ch["name"]
        temp_person.idNumber = ch["idNumber"]
        temp_person.phoneNumber = ch["phoneNumber"]
        temp_person.insert()
        
    return {"message": "successes"}

# 获取历史记录
@app.get("/safety/applications/{user_id}")
async def root(user_id: str):
    res_head = (SafeFormHead
           .select()
           .where(SafeFormHead.phoneNumber == user_id)
        )
    res_work = (workLocation
           .select()
           .join(SafeFormHead, JOIN.LEFT_OUTER, on=SafeFormHead.applicationNumber)
           .where(SafeFormHead.phoneNumber == user_id)
        )
    res_danger = (dangerTypes
           .select()
           .join(SafeFormHead, JOIN.LEFT_OUTER, on=SafeFormHead.applicationNumber)
           .where(SafeFormHead.phoneNumber == user_id)
        )
    res_accompaning = (accompaningPersons
           .select()
           .join(SafeFormHead, JOIN.LEFT_OUTER, on=SafeFormHead.applicationNumber)
           .where(SafeFormHead.phoneNumber == user_id)
        )
    print(res_head)
    res = []
    return res


if __name__ == "__main__":
    create_tables()
    print("数据库准备完成")
    uvicorn.run("main:app", host="localhost", port=5000, log_level="debug")
