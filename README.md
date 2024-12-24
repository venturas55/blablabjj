# blablaBJJ


==================
          NUEVA INSTALACION
Manual de nueva instalación.
La instalación de nodejs y el gestor de paquetes npm dependerá de si se realiza sobre un sistema Windows o un sistema Linux. Pasamos a detallar ambas opciones:

Instalación de la infraestructura en windows
Para instalar Node.js y npm en Windows, sigue estos pasos:
•	Ve al sitio web oficial de Node.js en https://nodejs.org.
•	En la página de inicio, verás dos opciones de descarga: LTS (Long-Term Support) y Current. Se recomienda descargar la versión LTS para obtener la versión estable más reciente.
•	Haz clic en el botón de descarga correspondiente a la versión LTS de Windows.
•	Selecciona la arquitectura de tu sistema operativo (32 o 64 bits) y haz clic en el archivo de instalación para descargarlo.
•	Una vez completada la descarga, ejecuta el archivo de instalación.
•	En el asistente de instalación, acepta los términos y condiciones y selecciona la ubicación de instalación.
•	Por defecto, se instalará Node.js junto con npm. Asegúrate de seleccionar la opción "Automatically install the necessary tools..." (Instalar automáticamente las herramientas necesarias) durante el proceso de instalación.
•	Haz clic en "Next" (Siguiente) y espera a que se complete la instalación.
•	Una vez finalizada la instalación, abre una ventana del símbolo del sistema (Command Prompt) o PowerShell.
•	Para verificar que Node.js y npm se hayan instalado correctamente, ejecuta los siguientes comandos:
•	node -v: muestra la versión de Node.js instalada.
•	npm -v: muestra la versión de npm instalada.
Para instalar MariaDB en Windows, puedes seguir los siguientes pasos:
•	Ve al sitio web oficial de MariaDB en https://mariadb.org/download/.
•	En la página de descargas, desplázate hacia abajo hasta la sección "Windows" y haz clic en el enlace "Download" (Descargar) correspondiente a la versión deseada de MariaDB.
•	En la siguiente página, verás una lista de los diferentes paquetes de instalación disponibles. Selecciona el paquete de instalación adecuado para tu versión de Windows (por ejemplo, Windows (x86), Windows (x86_64)).
•	La descarga comenzará automáticamente. Espera a que se complete la descarga del archivo de instalación.
•	Una vez que se haya completado la descarga, ejecuta el archivo de instalación (por ejemplo, mariadb-<versión>-win32.msi o mariadb-<versión>-winx64.msi).
•	En el asistente de instalación, acepta los términos y condiciones y selecciona la ubicación de instalación.
•	Durante el proceso de instalación, puedes elegir los componentes que deseas instalar. Asegúrate de seleccionar "Server" (Servidor) y "Client" (Cliente) para tener tanto el servidor de MariaDB como las herramientas de cliente necesarias.
•	Configura las opciones adicionales según tus necesidades, como el puerto de escucha y la configuración de contraseña del usuario root.
•	Finaliza el proceso de instalación y espera a que se complete.
•	Una vez finalizada la instalación, puedes abrir el cliente de línea de comandos de MariaDB o utilizar herramientas gráficas como phpMyAdmin para administrar tu servidor MariaDB.
 

Instalación de la infraestructura en linux
Para instalar Node.js y npm en Linux, puedes seguir estos pasos generales:
•	Abre la terminal en tu distribución de Linux.
•	Actualiza los repositorios de paquetes ejecutando el siguiente comando:
        o	sudo apt update
•	Instala Node.js y npm utilizando el administrador de paquetes de tu distribución. En el caso de Ubuntu o Debian, puedes ejecutar el siguiente comando:
        o	sudo apt install nodejs npm
•	Verifica que Node.js y npm se hayan instalado correctamente ejecutando los siguientes comandos:
        o	node -v
        o	npm -v
Estos comandos mostrarán la versión instalada de Node.js y npm respectivamente.

Para instalar MariaDB en Linux, puedes seguir estos pasos generales:
•	Abre la terminal en tu distribución de Linux.
•	Actualiza los repositorios de paquetes ejecutando el siguiente comando:
        o	sudo apt update
•	Instala MariaDB utilizando el administrador de paquetes de tu distribución. En el caso de Ubuntu o Debian, puedes ejecutar el siguiente comando:
        o	sudo apt install mariadb-server
•	Durante la instalación, se te pedirá que establezcas una contraseña para el usuario root de MariaDB. Asegúrate de elegir una contraseña segura y recuérdala.
•	Una vez finalizada la instalación, puedes iniciar el servicio de MariaDB ejecutando el siguiente comando:
        o	sudo systemctl start mariadb
•	Para configurar la seguridad básica de MariaDB, puedes ejecutar el siguiente comando y seguir las instrucciones:
        o	sudo mysql_secure_installation
•	A lo largo del proceso, se te realizarán varias preguntas sobre la configuración de seguridad. Se recomienda seguir las indicaciones y responder "Y" (sí) para cada pregunta.
•	Una vez completada la configuración de seguridad, puedes verificar que MariaDB esté funcionando ejecutando el siguiente comando:
        o	sudo systemctl status mariadb

•	Si el servicio está en ejecución, deberías ver un mensaje indicando que está activo y en ejecución.

Instalación del proyecto/app (Comun para Linux/Windows)
¡Ahora deberías tener tanto Node.js y npm como MariaDB instalados en tu sistema Windows/Linux!  Ahora solo faltaría instalar el proyecto en sí. Para ello, primeramente, elige la ruta de trabajo y descárgate el proyecto de github mediante:
git clone https://github.com/venturas55/blablabjj
esto descargará el proyecto en una carpeta llamada ‘blablabjj’.
Ahora podremos hacer uso del archivo ubicado en la ruta ‘./blablabjj/database/blablabjj.sql’ que nos ayudará a crear la estructura de la base de datos, creando todas las tablas necesarias. Para ello accederemos por consola a MariaDB mediante:
mysql -u db_user -p
Al ejecutar dicho comando, el sistema nos solicitará la contraseña de acceso del usuario ‘db_user’. Una vez en la consola de MariaDB se puede proceder a crear todas las tablas mediante:
source C:\...ruta...\blablabjj\database\sannuevo.sql
Si se deseara poblar la base de datos con datos de prueba se podría ejecutar 
source C:\...ruta...\blablabjj\database\poblarDDBB.sql
Una vez creada la base de datos habría que crear el archivo ‘.env’ que servirá para configurar la conexión con la base de datos. El contenido del ‘,env’ será:
                        DB_HOST=localhost
                        DB_USER=db_user
                        DB_PASS=db_pass
                        DB_NAME=blablabjj

Donde ‘db_user’ y ‘db_pass’ serán las credenciales de acceso a tu base de datos MariaDB. El nombre de la base de datos en caso de usar el archivo ubicado en la ruta ./pfcdaw/database/sannuevo.sql sería sanpfcdaw.




         RESUMEN NUEVA INSTALACION PUNTOS CLAVE
============================================================
1.- INSTALACION NODEJS/EXPRESS SERVER:
    git clone https://github.com/venturas55/blablabjj
    cd blablabjj
    crear .env con datos con las variables 
                                            DB_HOST=localhost
                                            DB_USER=usuario
                                            DB_PASS=contraseñapropia
                                            DB_NAME=nombrebasedatos
    npm install

2.- INSTALACION BASE DE DATOS
Para crear la estructura de tablas con un usuario
mysql -u root -p 
source \blablabjj\database\blablabjj.sql
source \blablabjj\database\blablabjj.sql
source /home/ubuntu/blablabjj/database/blablabjj.sql


Para poblarla de datos:
source \blablabjj\database\poblarDDBB.sql
source \blablabjj\database\poblarDDBB.sql
source /home/ubuntu/blablabjj/database/blablabjj.sql



===========================================

npm i 

if some modules needs highers version of nodejs, then you will find usefull how to

update nodejs
-------------------
npm install -g n
n <version-number>    or      n lts


# blablabjj
# blablabjj

==============================
la app necesita un .env con las siguientes variables:

DB_HOST=localhost
DB_USER=root
DB_PASS=weR65hS
DB_NAME=blablabjj
PORT=7001
STRIPE_PRIV=sk_test_dfhdfheK8esrhdgfh4E1OsFGutlABoIEJVDFbAEx4g23jdfhHMjdeshj
STRIPE_WEBHOOK_SECRET_KEY=whsec_bcdsfh742bsdfhb6701dsdsfhdfhbfgc8eb7bdsfgh71c1
BASE_URL=http://localhost
