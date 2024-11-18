const menu = document.querySelector(".comfy-menu");
const hr = document.createElement("hr");

hr.style.margin = "8px 0";
hr.style.width = "100%";
menu.append(hr);

const container = document.createElement("div");
container.id = "saveQueuesContainer";

const saveInput = document.createElement("input");
saveInput.id = "saveQueuesInput";
saveInput.type = "text";
saveInput.placeholder = "Nombre usuario";

//Si se pulsa enter, se guarda el nombre del usuario
saveInput.onkeypress = async (event) => {
    if (event.key === "Enter") {
        let text = saveInput.value;
        if (!text) {
            text = "Libre";
        }

        startTime = new Date();

        // Save the text and time to the server
        await fetch('/save-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: text, time: startTime.toISOString() })
        });

        // Update the button text and color
        saveButton.textContent = text;
        if (text === "Libre") {
            saveButton.style.backgroundColor = "green";
        } else {
            saveButton.style.backgroundColor = "red";
        }

        // Start the time counter
        updateTimeCounter();
        setInterval(updateTimeCounter, 1000);
    }

}


container.append(saveInput);

const saveButton = document.createElement("button");
saveButton.id = "saveQueuesButton";

// Load the text from the server
const response = await fetch('/load-user');
// Print the response text to the console
const data = await response.text();

// Parse the response text as JSON
const json = JSON.parse(data);
const savedText = json.user;
console.log(savedText);
const savedTime = json.time ? new Date(json.time) : null;
console.log(savedTime);
saveButton.textContent = savedText;

// Change button background color based on the file content
if (savedText === "Libre") {
    saveButton.style.backgroundColor = "green";
} else {
    saveButton.style.backgroundColor = "red";
}

const timeCounter = document.createElement("div");
timeCounter.id = "timeCounter";
container.append(timeCounter);

let startTime = savedTime;

// Start the time counter if there is a saved time
if (startTime) {
    updateTimeCounter();
    setInterval(updateTimeCounter, 1000);
}

saveButton.onclick = async () => {
    let text = saveInput.value;
    if (!text) {
        text = "Libre";
    }

    startTime = new Date();

    // Save the text and time to the server
    await fetch('/save-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: text, time: startTime.toISOString() })
    });

    // Update the button text and color
    saveButton.textContent = text;
    if (text === "Libre") {
        saveButton.style.backgroundColor = "green";
    } else {
        saveButton.style.backgroundColor = "red";
    }

    // Start the time counter
    updateTimeCounter();
    setInterval(updateTimeCounter, 1000);
}

function updateTimeCounter() {
    if (startTime) {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        //timeCounter.textContent = `Tiempo transcurrido: ${elapsedTime} segundos`;
        // Tiempo transcurrido en HH:MM:SS

        //Si el usuario es "Libre" no se muestra el tiempo
        if (saveButton.textContent === "Libre") {
            timeCounter.textContent = "";
        }else{ 
            //Si el usuario es distinto de "Libre" se muestra el tiempo
            timeCounter.textContent = `Tiempo sesión: ${new Date(elapsedTime * 1000).toISOString().substr(11, 8)}`;
            //Si el usuario lleva más de 3 hora se avisará con un mensaje cada 30 minutos
            if(elapsedTime > 3600*3){
                if(elapsedTime % 1800 === 0){
                    alert("Llevas más de 3 horas en la sesión");
                }
            }
        }
        

    }
}

container.append(saveButton);

// Agregar el contenedor al menú
menu.append(container);
