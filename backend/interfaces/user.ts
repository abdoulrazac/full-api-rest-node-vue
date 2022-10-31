export interface IUser {
    id: string,
    full_name: string,
    username: string,
    cnib_passport: string,
    lieu_cnib: string,
    date_naissance: Date,
    telephone: string,
    avatar?: string,
    description?: string,

    permis_type: string,
    permis_date?: Date,
    contrat_debut?: Date,
    contrat_fin?: Date,

    is_use?: boolean,

    email?: string,
    salt_password: string,
    hashed_password: string,
    is_active?: boolean,
    role?: string,
    is_superuser?: boolean,

    created_at?: Date,
    updated_at?: Date,
    creator_id?: string,
    updater_id?: string,

    is_delete?: boolean
}