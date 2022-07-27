export interface UserRegistration {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface UserAlias {
    user_id: number;
    alias: string;
    image_url: string;
}

export interface LogInUser {
    email: string;
    password: string;
}