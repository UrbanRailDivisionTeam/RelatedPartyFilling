from pydantic import BaseModel
from peewee import PostgresqlDatabase, Model, TextField, IntegerField, BooleanField, IdentityField, ForeignKeyField

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

    isDangerousWork: bool
    dangerTypes: list

    notifierName: str
    notifierNumber: str
    notifierDepartment: str

    accompaningCount:int
    accompaningPersons: list

# ------------数据库表的模型------------
database = PostgresqlDatabase(
    'public',
    host='172.29.22.83',
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
    workType = TextField(null=False)

    isProductWork = BooleanField()
    projectName = TextField(null=False)
    vehicleNumber = TextField(null=False)
    trackPosition = TextField(null=False)
    
    workContent = TextField(null=False)
    workBasis = TextField(null=False)
    basisNumber = TextField(null=False)

    isDangerousWork = BooleanField()

    notifierName = TextField(null=False)
    notifierNumber = TextField(null=False)
    notifierDepartment = TextField(null=False)

    accompaningCount = IntegerField()
    accompaningPersons: list
    age = IntegerField()
    
class workLocation(bd_base_model):
    formApplicationNumber = TextField(null=False)
    workLocation = TextField(null=False)
    
class dangerTypes(bd_base_model):
    formApplicationNumber = TextField(null=False)
    dangerTypes = TextField(null=False)
    
class accompaningPersons(bd_base_model):
    formApplicationNumber = TextField(null=False)
    name = TextField(null=False)
    idNumber = TextField(null=False)
    phoneNumber = TextField(null=False)

def create_tables():
    with database:
        database.create_tables([SafeFormHead, workLocation, dangerTypes, accompaningPersons])