const menu = document.querySelector(".comfy-menu");
const hr = document.createElement("hr");

hr.style.margin = "8px 0";
hr.style.width = "100%";
menu.append(hr);

const container = document.createElement("div");
container.id = "saveQueuesContainer";

// Create input field for user name
const saveInput = document.createElement("input");
saveInput.id = "saveQueuesInput";
saveInput.type = "text";
saveInput.placeholder = "Nombre usuario";

// Add event listener for Enter key on saveInput
saveInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        logInButton.click();
    }
});

// Create log in button
const logInButton = document.createElement('button');
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

// Create log out button
const logOutButton = document.createElement('button');
logOutButton.textContent = "Log Out";
// Apply ComfyUI styles
logOutButton.style.backgroundColor = "#f44336"; // Red background
logOutButton.style.color = "white"; // White text
logOutButton.style.border = "none"; // No border
logOutButton.style.padding = "10px 20px"; // Smaller padding
logOutButton.style.textAlign = "center"; // Centered text
logOutButton.style.textDecoration = "none"; // No underline
logOutButton.style.display = "inline-block"; // Inline-block display
logOutButton.style.fontSize = "14px"; // Smaller font size
logOutButton.style.margin = "2px 1px"; // Smaller margin
logOutButton.style.cursor = "pointer"; // Pointer cursor on hover
logOutButton.style.borderRadius = "8px"; // Rounded corners

// Add hover effect
logOutButton.onmouseover = () => {
    logOutButton.style.backgroundColor = "#d32f2f"; // Darker red on hover
};
logOutButton.onmouseout = () => {
    logOutButton.style.backgroundColor = "#f44336"; // Original red
};

// Create user list header
const userListHeader = document.createElement('h3');
userListHeader.textContent = "Usuarios activos";

// Create user list
const userList = document.createElement('ul');
userList.id = "userList";

// Create Teams link button
const teamsLinkButton = document.createElement('button');
teamsLinkButton.textContent = "Open ElRanchito Teams Channel";
// Apply ComfyUI styles
teamsLinkButton.style.backgroundColor = "#007BFF"; // Blue background
teamsLinkButton.style.color = "white"; // White text
teamsLinkButton.style.border = "none"; // No border
teamsLinkButton.style.padding = "10px 20px"; // Smaller padding
teamsLinkButton.style.textAlign = "center"; // Centered text
teamsLinkButton.style.textDecoration = "none"; // No underline
teamsLinkButton.style.display = "inline-block"; // Inline-block display
teamsLinkButton.style.fontSize = "14px"; // Smaller font size
teamsLinkButton.style.margin = "2px 1px"; // Smaller margin
teamsLinkButton.style.cursor = "pointer"; // Pointer cursor on hover
teamsLinkButton.style.borderRadius = "8px"; // Rounded corners

// Add hover effect
teamsLinkButton.onmouseover = () => {
    teamsLinkButton.style.backgroundColor = "#0056b3"; // Darker blue on hover
};
teamsLinkButton.onmouseout = () => {
    teamsLinkButton.style.backgroundColor = "#007BFF"; // Original blue
};

teamsLinkButton.onclick = () => {
    window.open('https://teams.microsoft.com/l/channel/19%3AlsfdwSK5auuJU9QOYGAzJebppgcyRGauJOhB-G4Dur81%40thread.tacv2/Stable%20Diffusion%20ELR?groupId=9f39b94f-74c0-4e00-94cb-231e35eaee66&ngc=true&allowXTenantAccess=true', '_blank');
};

// Append elements to the container
container.append(saveInput);
container.append(logInButton);
//container.append(logOutButton);
container.append(userListHeader); 
container.append(userList);
container.append(teamsLinkButton);

// Load the text from the server
const response = await fetch('/load-users');
const data = await response.text();
console.log("DATA"+data);

const json = JSON.parse(data);
console.log("JSON"+json);
const savedText = json.user;
const savedTime = json.time ? new Date(json.time) : null;
let startTime = savedTime;

// Mantener una lista de usuarios rellena con los usuarios leidos
let users =  [];
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
            body: JSON.stringify({ user: text, time: startTime.toISOString(), users: users })
        });
    };

    listItem.appendChild(logoutButton);
    userList.appendChild(listItem);
}

// Log in button click event
logInButton.onclick = async () => {
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

// Log out button click event
logOutButton.onclick = async () => {
    let text = saveInput.value;
    if (!text) {
        alert("Please enter a username to log out.");
        return;
    }

    // Eliminar usuario de la lista
    users = users.filter(user => user !== text);

    // Eliminar usuario del servidor y enviar lista de usuarios actualizada
    await fetch('/remove-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: text, users: users })
    });

    // Eliminar usuario de la lista del DOM
    const listItem = document.getElementById(`user-${text}`);
    if (listItem) {
        userList.removeChild(listItem);
    }

    // Limpiar campo de entrada
    saveInput.value = "";
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

// Agregar el contenedor al menú
menu.append(container);
