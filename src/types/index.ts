export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
            original_filename: string;
        };
    }

    interface CloudinaryWidget {
        open: () => void;
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export interface UploadWidgetValue {
    url: string;
    publicId: string;
    /**
     * Only present right after a fresh unsigned upload; Cloudinary's
     * delete_token expires ~10 minutes after upload and lets the browser
     * delete that asset directly, without hitting our backend.
     */
    deleteToken?: string;
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}

export enum UserRole {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
}

export type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    imageCldPubId?: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
};

export type Department = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type DepartmentListItem = Department & {
    totalSubjects: number;
};

export type DepartmentTotals = {
    subjects: number;
    classes: number;
    enrolledStudents: number;
};

export type DepartmentWithTotals = {
    department: Department;
    totals: DepartmentTotals;
};

export type Subject = {
    id: number;
    departmentId: number;
    name: string;
    code: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SubjectWithDepartment = Subject & {
    department: Department;
    totalClasses?: number;
};

export type Teacher = {
    id: number;
    userId: string;
    user?: Pick<User, "id" | "name" | "email">;
    createdAt: string;
    updatedAt: string;
};

export type Student = {
    id: number;
    userId: string;
    user?: Pick<User, "id" | "name" | "email">;
    createdAt: string;
    updatedAt: string;
};

export type ClassStatus = "active" | "inactive" | "archived";

export type ClassItem = {
    id: number;
    name: string;
    inviteCode: string;
    subjectId: number;
    teacherId: number;
    description?: string | null;
    bannerUrl?: string | null;
    bannerCldPubId?: string | null;
    capacity: number;
    status: ClassStatus;
    enrolledCount: number;
    createdAt: string;
    updatedAt: string;
};

export type ClassWithRelations = ClassItem & {
    subject: Subject | null;
    teacher: Teacher | null;
};

export type CapacityStatus = "available" | "nearFull" | "full";

export const capacityStatusOf = (enrolledCount: number, capacity: number): CapacityStatus => {
    if (capacity <= 0) return "available";
    const ratio = enrolledCount / capacity;
    if (ratio >= 1) return "full";
    if (ratio >= 0.8) return "nearFull";
    return "available";
};

export type Enrollment = {
    id: number;
    studentId: number;
    classId: number;
    enrolledAt: string;
    updatedAt: string;
};

export type EnrollmentWithStudent = Enrollment & {
    student: (Student & { user: Pick<User, "id" | "name" | "email"> | null }) | null;
};

export type DashboardScope = "admin" | "teacher";

export type DashboardOverview = {
    scope: DashboardScope;
    totalDepartments: number;
    totalSubjects: number;
    totalClasses: number;
    classesByStatus: { status: string; count: number }[];
    totalEnrollments: number;
    avgCapacityUtilization: number;
    usersByRole: { role: string; count: number }[] | null;
};

export type DashboardCharts = {
    enrollmentTrends: { month: string; count: number }[];
    classesByDepartment: { department: string; count: number }[];
    capacityStatus: { status: CapacityStatus; count: number }[];
    userDistribution: { role: string; count: number }[];
};

export type ActivityItem = {
    type: "enrollment" | "class_created" | "user_created";
    id: number | string;
    label: string;
    detail: string;
    timestamp: string;
};

export type SearchResultItem = {
    id: number | string;
    label: string;
    sublabel: string;
    resource: "users" | "departments" | "subjects" | "classes";
};

export type SearchResults = {
    users: SearchResultItem[];
    departments: SearchResultItem[];
    subjects: SearchResultItem[];
    classes: SearchResultItem[];
};

export type UserProfileSummary =
    | { teacherId: number; classes: { id: number; name: string; status: ClassStatus }[] }
    | { studentId: number; enrollments: { id: number; classId: number; className: string; enrolledAt: string }[] }
    | null;

export type UserWithProfile = User & { profile: UserProfileSummary };

export type SignUpPayload = {
    email: string;
    name: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};
