export interface LoginRequest{

    email: string;
    password: string;
}

export interface LoginResponse{

    token: string;
    refreshToken: string;
    user:{
        id : number;
        employeeId: string;
        FirstName: string;
        LastName: string;
        email: string;
        role: 'Employee' | 'Manager';
        departmentId: number;
        managerId: number;
    };
}

export interface TokenPayload{
    sub: string;
    email: string;
    role: string;
    userId: number;
    exp: number;
    iat: number;
}