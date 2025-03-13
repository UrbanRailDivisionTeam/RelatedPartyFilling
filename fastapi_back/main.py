import uvicorn
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
    temp_head.save()
    
    for ch in safefrom.workLocation:
        temp_work = workLocation()
        temp_work.formApplicationNumber = safefrom.applicationNumber
        temp_work.workLocation = ch
        temp_work.save()
        
    for ch in safefrom.dangerTypes:
        temp_danger = dangerTypes()
        temp_danger.formApplicationNumber = safefrom.applicationNumber
        temp_danger.dangerTypes = ch
        temp_danger.save()
        
    for ch in safefrom.accompaningPersons:
        temp_person = accompaningPersons()
        temp_person.formApplicationNumber = safefrom.applicationNumber
        temp_person.name = ch["name"]
        temp_person.idNumber = ch["idNumber"]
        temp_person.phoneNumber = ch["phoneNumber"]
        temp_person.save()
        
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
           .join(SafeFormHead, JOIN.LEFT_OUTER, on=(SafeFormHead.applicationNumber == workLocation.formApplicationNumber))
           .where(SafeFormHead.phoneNumber == user_id)
        )
    res_danger = (dangerTypes
           .select()
           .join(SafeFormHead, JOIN.LEFT_OUTER, on=(SafeFormHead.applicationNumber == dangerTypes.formApplicationNumber))
           .where(SafeFormHead.phoneNumber == user_id)
        )
    res_accompaning = (accompaningPersons
           .select()
           .join(SafeFormHead, JOIN.LEFT_OUTER, on=(SafeFormHead.applicationNumber == accompaningPersons.formApplicationNumber))
           .where(SafeFormHead.phoneNumber == user_id)
        )
    res = []
    for ch_head in res_head:
        temp = {}
        temp["applicationNumber"] = ch_head.applicationNumber
        temp["name"] = ch_head.name
        temp["idNumber"] = ch_head.idNumber
        temp["companyName"] = ch_head.companyName
        temp["phoneNumber"] = ch_head.phoneNumber
        temp["submitTime"] = ch_head.submitTime
        temp["startDate"] = ch_head.startDate
        temp["startTime"] = ch_head.startTime
        temp["workingHours"] = ch_head.workingHours
        temp["workType"] = ch_head.workType
        temp["isProductWork"] = ch_head.isProductWork
        temp["projectName"] = ch_head.projectName
        temp["vehicleNumber"] = ch_head.vehicleNumber
        temp["trackPosition"] = ch_head.trackPosition
        temp["workContent"] = ch_head.workContent
        temp["workBasis"] = ch_head.workBasis
        temp["basisNumber"] = ch_head.basisNumber
        temp["isDangerousWork"] = ch_head.isDangerousWork
        temp["notifierName"] = ch_head.notifierName
        temp["notifierNumber"] = ch_head.notifierNumber
        temp["notifierDepartment"] = ch_head.notifierDepartment
        temp["accompaningCount"] = ch_head.accompaningCount
        temp["workLocation"] = []
        temp["dangerTypes"] = []
        temp["accompaningPersons"] = []
        for ch_work in res_work:
            if ch_work.formApplicationNumber == ch_head.applicationNumber:
                temp["workLocation"].append(ch_work.workLocation)
        for ch_danger in res_danger:
            if ch_danger.formApplicationNumber == ch_head.applicationNumber:
                temp["dangerTypes"].append(ch_work.workLocation)
        for ch_accompaning in res_accompaning:
            if ch_accompaning.formApplicationNumber == ch_head.applicationNumber:
                temp2 = {}
                temp2["name"] = ch_accompaning.name
                temp2["idNumber"] = ch_accompaning.idNumber
                temp2["phoneNumber"] = ch_accompaning.phoneNumber
                temp["workLocation"].append(temp2)
        res.append(temp)
    return res


if __name__ == "__main__":
    create_tables()
    print("数据库准备完成")
    uvicorn.run("main:app", host="localhost", port=5000, log_level="debug")
