from pydantic import BaseModel
from peewee import PostgresqlDatabase

class SafeFrom(BaseModel):
    name: str
    idNumber: str
    companyName: str
    phoneNumber: str

    workingTime: list
    startDate: str
    endDate: str | None = None
    isProductWork: bool | None = None
    projectName: str | None = None
    vehicleNumber: str | None = None
    workLocation: list
    trackPosition: str | None = None
    workType: str
    workContent: str
    workBasis: str | None = None
    basisNumber: str | None = None

    dangerTypes: list | None = None
    isDangerousWork: bool | None = None

    notifierName: str
    notifierNumber: str | None = None
    notifierDepartment: str

    accompaningCount: int | None = None
    accompaningPersons: list | None = None
    
    
database = PostgresqlDatabase(
    'public',
    host='172.29.22.83',
    port=5432, 
    user='postgres', 
    password='Swq8855830.')