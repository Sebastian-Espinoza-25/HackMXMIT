import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const ScanComponent = ({ onDetected }) => {
    const lastDetectedTime = useRef(0); // Guarda la última vez que se detectó un código

    useEffect(() => {
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                },
                target: document.querySelector('#interactive') // Div donde se muestra el video
            },
            decoder: {
                readers: ["ean_reader"] // Configuración para EAN-13
            }
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });

        Quagga.onDetected((result) => {
            const code = result.codeResult.code;

            // Verifica que hayan pasado al menos 3 segundos desde la última lectura
            const currentTime = Date.now();
            if (currentTime - lastDetectedTime.current >= 3000) {
                // Actualiza el tiempo de la última detección
                lastDetectedTime.current = currentTime;

                // Filtra solo códigos que empiezan con "750"
                if (code.startsWith("750")) {
                    console.log("Código detectado:", code);
                    onDetected(code); // Llama al callback solo si cumple con el filtro
                }
            }
        });

        // Limpia al desmontar el componente
        return () => {
            Quagga.stop();
            Quagga.offDetected();
        };
    }, [onDetected]);

    return <div id="interactive" style={{ width: '100%', height: '100%' }}></div>;
};

export default ScanComponent;
