from pydantic import BaseModel
from peewee import PostgresqlDatabase, Model, TextField, IntegerField, BooleanField

# ------------前后端请求的模型------------
class SafeForm(BaseModel):
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

    dangerTypes: list

    notifierName: str
    notifierNumber: str
    notifierDepartment: str

    accompaningCount:int
    accompaningPersons: list

# ------------数据库表的模型------------
database = PostgresqlDatabase(
    'postgres',
    host='db',
    port=5432,
    user='postgres',
    password='Swq8855830.')

class bd_base_model(Model):
    class Meta:
        database = database

class SafeFormHead(bd_base_model):
    applicationNumber = TextField(null=False, unique=True)
    name = TextField(null=False)
    idNumber = TextField(null=False)
    companyName = TextField(null=False) 
    phoneNumber = TextField(null=False)

    submitTime = TextField(null=False)
    startDate = TextField(null=False)
    startTime = TextField(null=False)
    workingHours = TextField(null=False)
    workLocation = TextField(null=False)
    workType = TextField(null=False)

    isProductWork = BooleanField()
    projectName = TextField(null=False)
    vehicleNumber = TextField(null=False)
    trackPosition = TextField(null=False)
    
    workContent = TextField(null=False)
    workBasis = TextField(null=False)
    basisNumber = TextField(null=False)
    
    dangerTypes = TextField(null=False)

    notifierName = TextField(null=False)
    notifierNumber = TextField(null=False)
    notifierDepartment = TextField(null=False)

    accompaningCount = IntegerField()
    
class accompaningPersons(bd_base_model):
    formApplicationNumber = TextField(null=False)
    name = TextField(null=False)
    idNumber = TextField(null=False)
    phoneNumber = TextField(null=False)

def create_tables():
    with database:
        database.create_tables([SafeFormHead, accompaningPersons])