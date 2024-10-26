import React, { useState } from 'react';
import './SaleComponent.css'; // Importa el archivo CSS

const SaleComponent = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { text: "Bienvenid@" }
    ]);

    // Función para enviar comandos al backend y actualizar el "chat"
    const handleSend = async () => {
        if (input.trim() === "") return;

        // Agregar mensaje del usuario al chat
        const userMessage = { text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Imprimir en consola lo que se envía al POST
        console.log("Enviando comando al backend:", input);

        try {
            // Enviar el comando al backend
            const response = await fetch('http://localhost:3000/conversacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comando: input })
            });

            const data = await response.json();
            // Agregar respuesta del backend al chat
            const botMessage = { text: data.respuesta };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error al enviar el comando:", error);
            const errorMessage = { text: "Error al comunicarse con el servidor." };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        // Limpiar el campo de entrada y el código escaneado en el local storage
        setInput("");
        localStorage.removeItem("detectedCode");
    };

    // Función para completar el input con el detectedCode y enviarlo al chat
    const handleComplete = () => {
        const detectedCode = localStorage.getItem("detectedCode");
        if (detectedCode) {
            setInput(detectedCode);
            setTimeout(() => {
                handleSend(); // Envía automáticamente el mensaje una vez asignado
            }, 0);
        }
    };

    return (
        <div className="chatContainer">
            <div className="chatBox">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.type === "bot" ? "botMessage" : "userMessage"}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="inputContainer">
                <input
                    type="text"
                    placeholder="Escribe tu comando..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="input"
                />
                <button onClick={handleSend} className="sendButton">Enviar</button>
                <button onClick={handleComplete} className="sendButton">Completar</button>
            </div>
        </div>
    );
};

export default SaleComponent;
