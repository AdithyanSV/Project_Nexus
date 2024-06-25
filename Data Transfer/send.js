async function sendDataToPHP(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const responseData = await response.json();
        console.log('Received data from PHP:', responseData);

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Example usage
const dataGreet = { type: "login", id:"1000", name: "John" };
sendDataToPHP('http://localhost/send.php', dataGreet);

const dataFarewell = { type: "farewell", name: "John" };
sendDataToPHP('http://localhost/send.php', dataFarewell);

const dataInfo = { type: "info" };
sendDataToPHP('http://localhost/send.php', dataInfo);

const dataNoType = { name: "John" };
sendDataToPHP('http://localhost/send.php', dataNoType);
