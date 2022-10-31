-- -----------------------------------------------------
-- UUID Module installation
-- ----------------------------------------------------- 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- -----------------------------------------------------
-- Table users
-- -----------------------------------------------------
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id              UUID DEFAULT uuid_generate_v4(),
  full_name       VARCHAR(50) NOT NULL,
  username        VARCHAR(50) NOT NULL,
  cnib_passport   VARCHAR(50) NOT NULL,
  lieu_cnib       VARCHAR(50) NOT NULL,
  date_naissance  TIMESTAMP,
  telephone       VARCHAR(20) NOT NULL,
  avatar          VARCHAR(200),
  description     VARCHAR(200) ,

  permis_type     VARCHAR(50) NOT NULL,
  permis_date     TIMESTAMP,
  contrat_debut   TIMESTAMP,
  contrat_fin     TIMESTAMP,

  is_use          BOOLEAN NOT NULL DEFAULT FALSE,

  email           VARCHAR(100),
  salt_password   VARCHAR(200) NOT NULL,
  hashed_password VARCHAR(200) NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE ,
  role            VARCHAR(100) DEFAULT 'Guest',
  is_superuser    BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

    
  PRIMARY KEY (id),
  UNIQUE(username),
  UNIQUE(email)
);
CREATE INDEX idx_username ON users (username ASC);
CREATE INDEX idx_email ON users (email ASC);
INSERT INTO users (id, full_name, username, cnib_passport, lieu_cnib, date_naissance, telephone, permis_type, role, is_superuser, salt_password, hashed_password) 
VALUES ('3aeac064-8105-4340-b959-685eb47edb63', 'Abdoul Razac SANE', 'abdoulrazacsane', 'B0000001', 'Bobo-Dioulasso', '1997-06-06', '00226-71750706', 'C', 'SuperUser', TRUE, 'c130de7c45abf018e972f21c8666ee6195f37454', 'bb53665e25bbf8f33b47ef458eb484b6270f4825');

insert into users (id, full_name, username, email, cnib_passport, lieu_cnib, date_naissance, telephone, permis_type, role, salt_password, hashed_password) values ('19f418d0-8e17-4e58-adec-be60f7276fa2', 'Evered Mogg', 'emogg0', 'emogg0@gmail.com', '165-82-3697', 'Keffi', '1984-06-03', '632-751-2837', 'L', 'BasicUser', '0fca3e9edc11883ed2d6bded1169fcf848e5ab1abfc215f41782a0490707d8f2', '6099051f343db260af74bfa4f6b3e53cec629621');
insert into users (id, full_name, username, email, cnib_passport, lieu_cnib, date_naissance, telephone, permis_type, role, salt_password, hashed_password) values ('4cb32585-e889-4286-859e-9f11a2b042a1', 'Mavra Pirkis', 'mpirkis1', 'mpirkis1@gmail.com', '652-22-3102', 'Hengduo', '1975-08-05', '551-446-8244', 'L', 'BasicUser', '0fca3e9edc11883ed2d6bded1169fcf848e5ab1abfc215f41782a0490707d8f2', '6099051f343db260af74bfa4f6b3e53cec629621');
insert into users (id, full_name, username, email, cnib_passport, lieu_cnib, date_naissance, telephone, permis_type, role, salt_password, hashed_password) values ('e2dc252b-b621-414d-849f-484800c20d89', 'Guinna Piccop', 'gpiccop2', 'gpiccop2@gmail.com', '656-01-6732', 'La Victoria', '1981-05-06', '921-656-1332', 'XL', 'BasicUser', '0fca3e9edc11883ed2d6bded1169fcf848e5ab1abfc215f41782a0490707d8f2', '6099051f343db260af74bfa4f6b3e53cec629621');
insert into users (id, full_name, username, email, cnib_passport, lieu_cnib, date_naissance, telephone, permis_type, role, salt_password, hashed_password) values ('81a6a28d-e973-4738-9223-89f9b72c32c6', 'Araldo Augar', 'aaugar3', 'aaugar3@gmail.com', '266-37-9094', 'Mori', '1976-12-28', '996-279-7146', 'XL', 'BasicUser', '0fca3e9edc11883ed2d6bded1169fcf848e5ab1abfc215f41782a0490707d8f2', '6099051f343db260af74bfa4f6b3e53cec629621');
insert into users (id, full_name, username, email, cnib_passport, lieu_cnib, date_naissance, telephone, permis_type, role, salt_password, hashed_password) values ('3453c7e8-7e08-4622-99eb-fe32a017f912', 'Dulcy Jacmar', 'djacmar4', 'djacmar4@gmail.com', '675-94-4449', 'Manzanares', '1963-02-23', '836-840-7080', 'XL', 'BasicUser', '0fca3e9edc11883ed2d6bded1169fcf848e5ab1abfc215f41782a0490707d8f2', '6099051f343db260af74bfa4f6b3e53cec629621');



-- -----------------------------------------------------
-- Table societes
-- -----------------------------------------------------
DROP TABLE IF EXISTS societes;

CREATE TABLE societes (
  id              UUID DEFAULT uuid_generate_v4(),
  full_name       VARCHAR(100) NOT NULL,
  sigle           VARCHAR(50),
  email           VARCHAR(100),
  ifu             VARCHAR(100) NOT NULL,
  slogan          VARCHAR(50) NOT NULL,
  adresse         VARCHAR(100),
  telephone       VARCHAR(20) NOT NULL,
  avatar          VARCHAR(200),
  description     VARCHAR(200),

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

    
  PRIMARY KEY (id),
  UNIQUE(email)
);



-- -----------------------------------------------------
-- Table vehicules
-- -----------------------------------------------------
DROP TABLE IF EXISTS vehicules;

CREATE TABLE vehicules (
  id              UUID DEFAULT uuid_generate_v4(),
  immatriculation VARCHAR(100) NOT NULL,
  marque          VARCHAR(50),
  coleur          VARCHAR(50),
  date_achat      TIMESTAMP,
  date_circulation TIMESTAMP,
  modele          VARCHAR(50),
  volume          SMALLINT ,
  nb_essieux      SMALLINT,
  description     VARCHAR(200),

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

    
  PRIMARY KEY (id),
  UNIQUE(immatriculation)
);
CREATE INDEX idx_vehicule_immat ON vehicules (immatriculation ASC);



-- -----------------------------------------------------
-- Table remorques
-- -----------------------------------------------------
DROP TABLE IF EXISTS remorques;

CREATE TABLE remorques (
  id              UUID DEFAULT uuid_generate_v4(),
  tracteur_id     UUID NOT NULL,
  benne_id        UUID NOT NULL,
  conducteur_id   UUID NOT NULL, 
  description     VARCHAR(200),

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

    
  PRIMARY KEY (id)
); 


-- -----------------------------------------------------
-- Table trajets
-- -----------------------------------------------------
DROP TABLE IF EXISTS trajets;

CREATE TABLE trajets (
  id              UUID DEFAULT uuid_generate_v4(),
  remorque_id     UUID NOT NULL,

  ref_bon         VARCHAR(50),
  date_depart     TIMESTAMP,
  date_arrivee    TIMESTAMP,
  type_trajet     VARCHAR(50),
  lieu_depart     VARCHAR(50),
  lieu_arrivee    VARCHAR(50),
  produit         VARCHAR(100),
  volume          SMALLINT,
  poids_vide      SMALLINT,
  poids_charge    SMALLINT,
  description     VARCHAR(200),

  is_deliver      BOOLEAN DEFAULT FALSE,
  is_invoiced     BOOLEAN DEFAULT FALSE,
  facture_id      UUID NOT NULL,

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

  PRIMARY KEY (id),
  UNIQUE(ref_bon)
); 
CREATE INDEX idx_trajets_ref_bon ON trajets (ref_bon ASC);



-- -----------------------------------------------------
-- Table depenses
-- -----------------------------------------------------
DROP TABLE IF EXISTS depenses;

CREATE TABLE depenses (
  id              UUID DEFAULT uuid_generate_v4(),
  remorque_id     UUID NOT NULL,

  libelle         VARCHAR(100),
  nombre          SMALLINT,
  prix_unit       SMALLINT,
  montant         SMALLINT,
  description     VARCHAR(200),

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

    
  PRIMARY KEY (id)
); 


-- -----------------------------------------------------
-- Table factures
-- -----------------------------------------------------
DROP TABLE IF EXISTS factures;

CREATE TABLE factures (
  id              UUID DEFAULT uuid_generate_v4(),
  ref_facture     VARCHAR(100),

  libelle         VARCHAR(100),
  description     VARCHAR(200),

  is_draft        BOOLEAN DEFAULT TRUE,
  is_pay          BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_id      UUID,

  is_delete       BOOLEAN DEFAULT FALSE,

    
  PRIMARY KEY (id)
); 
CREATE INDEX idx_factures_ref ON factures (ref_facture ASC);
