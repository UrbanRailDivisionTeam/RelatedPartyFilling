from pydantic import BaseModel
from peewee import PostgresqlDatabase, Model, TextField, IntegerField, SQL

# ------------前后端请求的模型------------
class SafeFrom(BaseModel):
    applicationNumber: str
    name: str
    idNumber: str
    companyName: str
    phoneNumber: str

    submitTime: str
    startDate: str
    startTime: str
    workingHours: str
    workLocation: list
    workType: str

    isProductWork: bool
    projectName: str
    vehicleNumber: str
    trackPosition: str
    
    workContent: str
    workBasis: str
    basisNumber: str

    isDangerousWork: bool
    dangerTypes: list

    notifierName: str
    notifierNumber: str
    notifierDepartment: str

    accompaningCount:int
    accompaningPersons: list


database = PostgresqlDatabase(
    'public',
    host='172.29.22.83',
    port=5432,
    user='postgres',
    password='Swq8855830.')

# ------------数据库表的模型------------
class MyUser (Model):
    name = TextField()
    city = TextField(constraints=[SQL("DEFAULT 'Mumbai'")])
    age = IntegerField()
    class Meta:
        database = database
        db_table = 'mysql'
