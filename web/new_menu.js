import { app } from '../../scripts/app.js'
//import * as shared from './comfy_shared.js'

// Crear titulo
const title = document.createElement("h2");
title.textContent = "ElRanchito usuarios activos";

// Create log in button
const logInButton = document.createElement('button');

// Create input field for user name
const saveInput = document.createElement("input");

// Create user list header
const userListHeader = document.createElement('h3');
userListHeader.textContent = "Usuarios activos";

// Create user list
const userList = document.createElement('ul');
userList.id = "userList";

var startTime;

// Agregar estilos CSS para personalizar el icono y cambiarlo a rojo
document.head.insertAdjacentHTML("beforeend", `
  <style>
      .custom-tab-icon {
          color: red !important; /* Cambia el color del icono a rojo */
          
      }
  </style>
`);
      
app.extensionManager.registerSidebarTab({
  id: "custom-tab",
  name: "ElRanchito Users",
  icon: "pi pi-users custom-tab-icon",
  tooltip: 'ElRanchito Users',
  type: 'custom',
  render: async (container) => {
      // Limpiar contenido previo
      container.innerHTML = "";


      await load(container);
  }
});


async function load(container){

  logInButton.textContent = "Log In";
  // Apply ComfyUI styles
  logInButton.style.backgroundColor = "#4CAF50"; // Green background
  logInButton.style.color = "white"; // White text
  logInButton.style.border = "none"; // No border
  logInButton.style.padding = "10px 20px"; // Smaller padding
  logInButton.style.textAlign = "center"; // Centered text
  logInButton.style.textDecoration = "none"; // No underline
  logInButton.style.display = "inline-block"; // Inline-block display
  logInButton.style.fontSize = "14px"; // Smaller font size
  logInButton.style.margin = "2px 1px"; // Smaller margin
  logInButton.style.cursor = "pointer"; // Pointer cursor on hover
  logInButton.style.borderRadius = "8px"; // Rounded corners
  
  // Add hover effect
  logInButton.onmouseover = () => {
      logInButton.style.backgroundColor = "#45a049"; // Darker green on hover
  };
  logInButton.onmouseout = () => {
      logInButton.style.backgroundColor = "#4CAF50"; // Original green
  };
  
  
  saveInput.id = "saveQueuesInput";
  saveInput.type = "text";
  saveInput.placeholder = "Nombre usuario";
  
  // Add event listener for Enter key on saveInput
  /*
  saveInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          logInButton.click();
      }
  });
  */ 
  
  
  
  // Log in button click event
  logInButton.onclick = async () => {
  
    console.log("CLICKED LOGIN");
    let text = saveInput.value;
    if (!text) {
        // Mensaje de alerta si no se ha introducido un nombre de usuario
        alert("Please, enter a username to log in.");
        return;
    }
  
    // Si el usuario ya está en la lista, no hacer nada
    if (users.includes(text)) {
        alert("The user is already logged in.");
        return;
    }
  
    startTime = new Date();
  
    // Añadir usuario a la lista
    users.push(text);
  
    // Guardar el texto, tiempo y lista de usuarios en el servidor
    await fetch('/save-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: text, time: startTime.toISOString(), users: users })
    });
  
    // Añadir usuario a la lista del DOM
    const listItem = document.createElement('li');
    listItem.textContent = text;
    listItem.id = `user-${text}`;
    listItem.style.display = "flex"; // Usar flexbox
    listItem.style.justifyContent = "space-between"; // Espacio entre el nombre y el botón
    listItem.style.alignItems = "center"; 
        // Crear botón de logout para el nuevo usuario
        const logoutButton = document.createElement('button');
        logoutButton.textContent = "X"; // Texto del botón
        logoutButton.style.marginLeft = "10px";
        logoutButton.style.backgroundColor = "#f44336"; // Red background
        logoutButton.style.color = "white"; // White text
        logoutButton.style.border = "none"; // No border
        logoutButton.style.padding = "5px 10px"; // Padding
        logoutButton.style.textAlign = "center"; // Centered text
        logoutButton.style.textDecoration = "none"; // No underline
        logoutButton.style.display = "inline-block"; // Inline-block display
        logoutButton.style.fontSize = "12px"; // Font size
        logoutButton.style.cursor = "pointer"; // Pointer cursor on hover
        logoutButton.style.borderRadius = "4px"; // Rounded corners
  
        logoutButton.onclick = async () => {
            console.log('Botón de cierre de sesión clicado');
            
            // Eliminar usuario de la lista
            users = users.filter(u => u !== text);
            userList.removeChild(listItem);
    
            // Guardar la lista de usuarios actualizada en el servidor
            await fetch('/remove-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: text, time: startTime.toISOString(), users: users })
            });
            
        };
    
        listItem.appendChild(logoutButton);
        userList.appendChild(listItem);
  
  
    };

    // Start the time counter if there is a saved time
if (startTime) {
  updateTimeCounter();
  setInterval(updateTimeCounter, 1000);
}

function updateTimeCounter() {
  if (startTime) {
      const now = new Date();
      const elapsedTime = Math.floor((now - startTime) / 1000);
      // Tiempo transcurrido en HH:MM:SS
      const timeCounter = document.getElementById("timeCounter");
      if (timeCounter) {
          timeCounter.textContent = `Tiempo sesión: ${new Date(elapsedTime * 1000).toISOString().substr(11, 8)}`;
      }
  }
}


// Intervalo en milisegundos (por ejemplo, 5000 ms = 5 segundos)
const updateInterval = 5000;

setInterval(async () => {
  const response = await fetch('/load-users');
  const data = await response.text();
  const json = JSON.parse(data);
  const newUsers = json.users;
  startTime = new Date();

  // Actualizar la lista de usuarios si hay cambios
  if (JSON.stringify(users) !== JSON.stringify(newUsers)) {
      users = newUsers;
      userList.innerHTML = ''; // Limpiar la lista actual

      for (let user of users) {
          const listItem = document.createElement('li');
          listItem.textContent = user;
          listItem.id = `user-${user}`;
          listItem.style.display = "flex"; // Usar flexbox
          listItem.style.justifyContent = "space-between"; // Espacio entre el nombre y el botón
          listItem.style.alignItems = "center"; 
          userList.appendChild(listItem);

          // Crear botón de logout para cada usuario
          const logoutButton = document.createElement('button');
          logoutButton.textContent = "X"; // Texto del botón
          logoutButton.style.marginLeft = "10px";
          logoutButton.style.backgroundColor = "#f44336"; // Red background
          logoutButton.style.color = "white"; // White text
          logoutButton.style.border = "none"; // No border
          logoutButton.style.padding = "5px 10px"; // Padding
          logoutButton.style.textAlign = "center"; // Centered text
          logoutButton.style.textDecoration = "none"; // No underline
          logoutButton.style.display = "inline-block"; // Inline-block display
          logoutButton.style.fontSize = "12px"; // Font size
          logoutButton.style.cursor = "pointer"; // Pointer cursor on hover
          logoutButton.style.borderRadius = "4px"; // Rounded corners

          logoutButton.onclick = async () => {
              // Eliminar usuario de la lista
              users = users.filter(u => u !== user);
              userList.removeChild(listItem);

              // Guardar la lista de usuarios actualizada en el servidor
              await fetch('/remove-user', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ user: user, time: startTime.toISOString(), users: users })
              });
          };

          listItem.appendChild(logoutButton);
          userList.appendChild(listItem);
      }
  }
}, updateInterval);

    

    // Crear el botón de Teams
    const teamsLinkButton = document.createElement('button');
    teamsLinkButton.style.display = "flex";
    teamsLinkButton.style.alignItems = "center";
    teamsLinkButton.style.backgroundColor = "#007BFF"; // Blue background
    teamsLinkButton.style.color = "white"; // White text
    teamsLinkButton.style.border = "none"; // No border
    teamsLinkButton.style.padding = "10px 20px"; // Smaller padding
    teamsLinkButton.style.textAlign = "center"; // Centered text
    teamsLinkButton.style.textDecoration = "none"; // No underline
    teamsLinkButton.style.fontSize = "14px"; // Smaller font size
    teamsLinkButton.style.margin = "2px 1px"; // Smaller margin
    teamsLinkButton.style.cursor = "pointer"; // Pointer cursor on hover
    teamsLinkButton.style.borderRadius = "8px"; // Rounded corners
  
    // Crear el icono de Teams
    const teamsIcon = document.createElement('img');
    teamsIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/2203px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png'; // Reemplaza con la URL de la imagen del icono de Teams
    teamsIcon.alt = 'Teams Icon';
    teamsIcon.style.width = '20px'; // Ajusta el tamaño del icono según sea necesario
    teamsIcon.style.height = '20px'; // Ajusta el tamaño del icono según sea necesario
    teamsIcon.style.marginRight = '8px'; // Espacio entre el icono y el texto
  
  
    // Añadir efecto hover
    teamsLinkButton.onmouseover = () => {
        teamsLinkButton.style.backgroundColor = "#0056b3"; // Darker blue on hover
    };
    teamsLinkButton.onmouseout = () => {
        teamsLinkButton.style.backgroundColor = "#007BFF"; // Original blue
    };
  
    teamsLinkButton.onclick = () => {
      console.log("ONCLICK");
        window.open('https://teams.microsoft.com/l/channel/19%3AlsfdwSK5auuJU9QOYGAzJebppgcyRGauJOhB-G4Dur81%40thread.tacv2/Stable%20Diffusion%20ELR?groupId=9f39b94f-74c0-4e00-94cb-231e35eaee66&ngc=true&allowXTenantAccess=true', '_blank');
    };
    // Añadir el icono y el texto al botón
    teamsLinkButton.appendChild(teamsIcon);
    teamsLinkButton.appendChild(document.createTextNode('Open ElRanchito Teams Channel'));
  
    container.append(title);
    // Añadir el botón al contenedor
    container.append(teamsLinkButton);
  

    container.append(saveInput);
    container.append(logInButton);

  
  
    container.append(userListHeader); 
    container.append(userList);


  const response = await fetch('/load-users');
  const data = await response.text();

  console.log("USERS",data);
  //var data = {users:["Rodrigo Alonso"]}
  const json = JSON.parse(data);
  //const json = data;
  const newUsers = json.users;
  startTime = new Date();


  // Mantener una lista de usuarios rellena con los usuarios leidos
  let users =  [];
  userList.innerHTML=''
  for (let user of json.users) {
      users.push(user);
      const listItem = document.createElement('li');
      listItem.textContent = user;
      listItem.id = `user-${user}`;
      listItem.style.display = "flex"; // Usar flexbox
      listItem.style.justifyContent = "space-between"; // Espacio entre el nombre y el botón
      listItem.style.alignItems = "center"; 
      userList.appendChild(listItem);

      // Crear botón de logout para cada usuario
      const logoutButton = document.createElement('button');
      logoutButton.textContent = "X"; // Texto del botón
      logoutButton.style.marginLeft = "10px";
      logoutButton.style.backgroundColor = "#f44336"; // Red background
      logoutButton.style.color = "white"; // White text
      logoutButton.style.border = "none"; // No border
      logoutButton.style.padding = "5px 10px"; // Padding
      logoutButton.style.textAlign = "center"; // Centered text
      logoutButton.style.textDecoration = "none"; // No underline
      logoutButton.style.display = "inline-block"; // Inline-block display
      logoutButton.style.fontSize = "12px"; // Font size
      logoutButton.style.cursor = "pointer"; // Pointer cursor on hover
      logoutButton.style.borderRadius = "4px"; // Rounded corners


      
      logoutButton.onclick = async () => {
          // Eliminar usuario de la lista
          users = users.filter(u => u !== user);
          userList.removeChild(listItem);
          
          
          // Guardar la lista de usuarios actualizada en el servidor
          await fetch('/remove-user', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ user: user, time: startTime.toISOString(), users: users })
          });
          
      };
      
    
      listItem.appendChild(logoutButton);
      //userList.innerHTML=''
      userList.appendChild(listItem);
    

};
}