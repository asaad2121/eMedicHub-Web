export type UserProfile = {
        last_name: string,
        dob: string,
        first_name: string,
        id: string,
        phone?:string,
        email: string,
        visiting_hours?:Slot
}
export type Slot = {
    monday: string |null,
    tuesday: string |null,
    wednesday: string | null,
    thursday: string | null,   
    friday: string | null,            
}

export type ResetPassword = {
    id : string,
    oldPassword : string,
    newPassword : string,
}