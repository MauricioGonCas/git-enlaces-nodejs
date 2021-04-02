CREATE DATABASE baselinks

USE baselinks

-- TABLA USUARIOS---
CREATE TABLE usuario(
    id INT(11) NOT NULL,
    nombreusuario VARCHAR(16) NOT NULL,
    contrasena VARCHAR(60) NOT NULL,
    nombrecompleto VARCHAR(100) NOT NULL
)

ALTER TABLE usuario
 ADD PRIMARY KEY (id);

 ALTER TABLE usuario 
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

  DESCRIBE usuario
  
  SELECT * FROM USUARIO
  
  --TABLA LINKS
  CREATE TABLE link(
  id INT(11) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  descripcion TEXT,
  usuario_id INT(11),
  fechacreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
  )

ALTER TABLE link 
	ADD PRIMARY KEY (id);
    
ALTER TABLE link 
	modify id 	INT(11) NOT NULL auto_increment,auto_increment=2
    
     DESCRIBE LINK
    SELECT * FROM USUARIO;
    SELECT * FROM link;