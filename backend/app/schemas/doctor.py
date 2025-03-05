'''
This is where the pydantic should come in
'''

from pydantic import BaseModel

class DoctorBase(BaseModel):
    full_name: str
    email: str
    mobile_no: str