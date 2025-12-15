export interface User {
  id : number;  
  employeeId: string;
  FirstName: string;
  LastName: string;
  email: string;
  role: 'Employee' | 'Manager';
  departmentId: number;
  departmentName?: string;
  managerId: number;
}

export interface UserProfile extends User {
  phoneNumber?: string;
  joiningDate: Date;
  designation: string;
}