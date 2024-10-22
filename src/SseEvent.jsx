import { useEffect, useState } from "react";

function SseEvent() {
    const [organizationId, setOrganizationId] = useState("");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        let eventSource;

        if (organizationId) {
            // Conectar al SSE a la URL de eventos con el organizationId
            eventSource = new EventSource(
                `http://localhost:3000/events/${organizationId}`
            );

            // Escuchar eventos para la organización específica
            eventSource.addEventListener(
                `organization-${organizationId}`,
                (event) => {
                    const parsedData = JSON.parse(event.data);
                    setEvents((prevEvents) => [...prevEvents, parsedData]);
                }
            );

            // Manejar error en la conexión SSE
            eventSource.onerror = (error) => {
                console.error("Error en SSE:", error);
                eventSource.close();
            };
        }

        // Limpiar la conexión cuando el componente se desmonta
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [organizationId]);

    const emitEvent = () => {
        fetch("http://localhost:3000/events/emit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                organizationId,
                message: `Mensaje para la organización ${organizationId}`,
            }),
        });
    };

    return (
        <div>
            <h3>Eventos recibidos para la organización: {organizationId}</h3>

            <input
                type="text"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                placeholder="Ingresa Organization ID"
            />

            <button onClick={emitEvent}>Emitir Evento</button>

            <h3>Eventos recibidos para la organización {organizationId}:</h3>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        {event.message} -{" "}
                        {new Date(event.timestamp).toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SseEvent;
