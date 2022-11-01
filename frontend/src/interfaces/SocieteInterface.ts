export interface ISociete {
    id : number ;
    full_name : string ;
    sigle : string ;
    email : string ;
    ifu : string ;
    slogan : string ;
    adresse : string ;
    avatar : string ;
    telephone : string ;
    description : string ;
    created_at : Date ;
    _links : any;
}

export interface ISocieteUpdate {
    full_name? : string ;
    sigle? : string ;
    email? : string ;
    ifu? : string ;
    slogan? : string ;
    adresse? : string ;
    avatar? : string ;
    telephone? : string ;
    description? : string ;
}

export interface ISocieteCreate {
    full_name : string ;
    sigle : string ;
    email : string ;
    ifu : string ;
    slogan : string ;
    adresse : string ;
    avatar : string ;
    telephone : string ;
    description : string ;
}
