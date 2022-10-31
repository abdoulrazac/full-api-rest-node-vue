-- -----------------------------------------------------
-- Table system_acl_roles
-- -----------------------------------------------------
DROP TABLE IF EXISTS `system_acl_roles`;
CREATE TABLE `system_acl_roles` (
  role_id         INT NOT NULL,
  role_name       VARCHAR(100) NOT NULL,
  description     VARCHAR(200),
  access_level    SMALLINT NOT NULL,

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  updated_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 
  updater_at      UUID, 

 PRIMARY KEY (role_id) ,
 UNIQUE(role_name)
);
-- First insertions
INSERT INTO `system_acl_roles` (`role_id` , `role_name` , `description` , `accesslevel`)
VALUES (1, 'SuperUser'   , 'Le role associe aux utilisateurs devant administrer et acceder a toutes le fonctionnalites' , 1  ) , 
       (2, 'AdminUser', 'Correspond aux utilisateurs devant administrer la plateforme,mais ne peuvent pas acceder a toutes les fonctionnalites',2 ), 
       (3, "BasicUser", 'Correspond aux simples utilisateurs de base de la plateforme'  ,  10  ) , 
       (4, "Guest"        , 'Ce role est associé à tous les utilisateurs de type invités, qui nont pas de compte' , 100  );


-- -----------------------------------------------------
-- Table system_acl_parentroles : pour les héritages
-- -----------------------------------------------------
DROP TABLE IF EXISTS `system_acl_parentroles`;
CREATE TABLE `system_acl_parentroles` (
  child_role_id   INT NOT NULL,
  parent_role_id  INT NOT NULL,

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID,

 PRIMARY KEY (`childroleid` , `parentroleid`)
);
-- First insertions
INSERT INTO `system_acl_parentroles` (`childroleid` , `parentroleid`)
VALUES (3 , 4) , (2 , 3) , (1 , 2);



-- -----------------------------------------------------
-- Table system_acl_resources : pour les héritages
-- -----------------------------------------------------

DROP   TABLE IF EXISTS `system_acl_resources`;
CREATE TABLE `system_acl_resources` (

  resource_id     INT NOT NULL,
  resource_name   VARCHAR(50) NOT NULL,
  description     VARCHAR(200),
  parent_id       SMALLINT,
  module_id       SMALLINT,
  is_active       BOOLEAN DEFAULT TRUE,

  created_at      TIMESTAMP DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
  creator_id      UUID, 

 PRIMARY KEY (resource_id)
);

/* ******* On insère les ressources par defaut de l'application******** */
INSERT INTO `system_acl_resources` (`resourceid` , `resourcename` , `description` , `parentid` , `creatoruserid` , `moduleid` , `enabled`, `applicationid`)
VALUES (1 , 'accounts'  , "Gestion des comptes des utilisateurs", 2 , 1 , 1 , 1, 1) , 
       (2 , 'account'   , "Gestion de mon compte dans la plateforme" , 0 , 1 , 1 , 1, 1) , 
       (3 , 'useroles'  , 'Gestion des roles des utilisateurs' , 0 , 1 , 1 , 1, 1) , 
       (4 , 'userights' , 'Gestion des permissions des utilisateurs' , 0 , 1 , 1 , 1, 1) , 
       (5 , 'system'    , 'Gestion des paramètres du système'  ,  0  ,  1  ,  1  ,  1 , 1 ) , 
       (6 , 'profile'   , 'Gestion des profils des utilisateurs'  ,  0  ,  1  ,  1  ,  1, 1 ) , 
       (7 , 'userdocuments', 'La gestion des documents des utilisateurs'  ,  0  ,  1  ,  1  ,  1, 1),
       (8 , 'ajaxres'  ,'La ressource qui fournit des services REST'  ,  0  ,  1  ,  1  ,  1, 1),
       (9 , 'dashboard','Le tableau de bord de lutilisateur après la connexion à son compte'  ,  0  ,  1  ,  1  ,  1, 1);