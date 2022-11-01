export interface IUserProfile {
    id: string ;
    email: string;
    full_name : string ;
    cnib_passport : string ;
    lieu_cnib : string ;
    date_naissance : string ;
    telephone : string ;
    description : string ;
    permis_type : string ;
    permis_date : string ;
    contrat_debut : string ;
    contrat_fin : string ;
    is_use : boolean ;
    is_active : boolean ;
    role : string ;
    is_superuser : boolean ;
    created_at : string ;
    _links : any;
}

export interface IUserProfileUpdate {
    email?: string;
    full_name? : string ;
    cnib_passport? : string ;
    lieu_cnib? : string ;
    date_naissance? : string ;
    telephone? : string ;
    description? : string ;
    permis_type? : string ;
    permis_date? : string ;
    contrat_debut? : string ;
    contrat_fin? : string ;
    password? : string ;
    is_use? : boolean ;
    is_active? : boolean ;
    role : string ;
    is_superuser? : boolean ;
}

export interface IUserProfileCreate {
    email : string ;
    full_name : string ;
    cnib_passport : string ;
    lieu_cnib : string ;
    date_naissance : string ;
    telephone : string ;
    description : string ;
    permis_type : string ;
    permis_date : string ;
    contrat_debut : string ;
    contrat_fin : string ;
    password : string ;
    is_use : boolean ;
    is_active : boolean ;
    role : string ;
    is_superuser : boolean ;
}
