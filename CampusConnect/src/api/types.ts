export interface User {
    id: string;
    email: string;
    username: string;
    role: "student" | "professor";
}

export interface AuthPayload {
    token: string;
    user: User;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    username: string;
    password: string;
    role?: string;
}


export interface Class {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    room: string;
    color: string;
    professorId?: string;
    courseId?: string;
    professor?: {
        id: string;
        pseudo: string;
        email: string;
    };
    enrollments?: Enrollment[];
    gradeStats?: {
        median: number;
        lowest: number;
        highest: number;
        average: number;
    };
}

export interface ClassInput {
    title: string;
    description: string;
    start: string;
    end: string;
    room: string;
    color: string;
    courseId?: string;
}

export interface Enrollment {
    id: string;
    classId: string;
    studentId: string;
    enrolledAt: string;
    student?: {
        id: string;
        pseudo: string;
        email: string;
    };
}
