import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse  # 响应html
from fastapi.staticfiles import StaticFiles # 设置静态目录
from peewee import JOIN
from model import create_tables, SafeForm, SafeFormHead, accompaningPersons

app = FastAPI()

app.mount("/static", StaticFiles(directory='static'), name="dist")
app.mount("/assets", StaticFiles(directory='static/assets'), name="dist")

html_content = ''
with open('static/index.html') as f:
    html_content = f.read()

@app.get("/")
async def main():
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/favicon.ico")
async def get_favicon():
    return {"file": "static/favicon.ico"}

# 用户登录
@app.get("/api/safety/user/{user_id}")
async def login_user(user_id: str):
    return {"message": "successes"}

# 提交申请
@app.post("/api/safety/submit")
async def applications(safefrom: SafeForm):
    try:
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
        temp_head.notifierName = safefrom.notifierName
        temp_head.notifierNumber = safefrom.notifierNumber
        temp_head.notifierDepartment = safefrom.notifierDepartment
        temp_head.accompaningCount = safefrom.accompaningCount
        temp_head.workLocation = safefrom.workLocation
        temp_danger = ","
        for ch in safefrom.dangerTypes:
            temp_danger += (ch + ",")
        temp_head.dangerTypes = temp_danger
        temp_head.save()
            
        for ch in safefrom.accompaningPersons:
            temp_person = accompaningPersons()
            temp_person.formApplicationNumber = safefrom.applicationNumber
            temp_person.name = ch["name"]
            temp_person.idNumber = ch["idNumber"]
            temp_person.phoneNumber = ch["phoneNumber"]
            temp_person.save()
        return {"message": "successes"}
    except Exception as e:
        print(e)
    finally:
        return {"message": "false"}

# 获取历史记录
@app.get("/api/safety/applications/{user_id}")
async def root(user_id: str):
    res = []
    try:
        res_head = (SafeFormHead
            .select()
            .where(SafeFormHead.phoneNumber == user_id)
            )
        res_accompaning = (accompaningPersons
            .select()
            .join(SafeFormHead, JOIN.LEFT_OUTER, on=(SafeFormHead.applicationNumber == accompaningPersons.formApplicationNumber))
            .where(SafeFormHead.phoneNumber == user_id)
            )
        
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
            temp["notifierName"] = ch_head.notifierName
            temp["notifierNumber"] = ch_head.notifierNumber
            temp["notifierDepartment"] = ch_head.notifierDepartment
            temp["accompaningCount"] = ch_head.accompaningCount
            temp["workLocation"] = ch_head.workLocation
            temp["dangerTypes"] = []
            temp["accompaningPersons"] = []
            temp_dangerTypes = str(ch_head.dangerTypes).split(',')
            for ch_danger in temp_dangerTypes:
                temp["dangerTypes"].append(ch_danger)
            for ch_accompaning in res_accompaning:
                if ch_accompaning.formApplicationNumber == ch_head.applicationNumber:
                    temp2 = {}
                    temp2["name"] = ch_accompaning.name
                    temp2["idNumber"] = ch_accompaning.idNumber
                    temp2["phoneNumber"] = ch_accompaning.phoneNumber
                    temp["accompaningPersons"].append(temp2)
            res.append(temp)
    except Exception as e:
        print(e)
    return res

if __name__ == "__main__":
    create_tables()
    print("数据库准备完成")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="debug")
