import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScanComponent from '../AppScanTools/ScanComponent';
import SaleComponent from '../AppScanTools/SaleComponent';

import '../PagesStyles/AppScanStyle.css';

function AppScan() {
    const navigate = useNavigate();
    const [, setDetectedCode] = useState("");
    const [, setIsCodeDetected] = useState(false);

    // Recuperar el código detectado del local storage al cargar el componente
    useEffect(() => {
        const savedCode = localStorage.getItem("detectedCode");
        if (savedCode) {
            setDetectedCode(savedCode);
        }
    }, []);

    const handleDetected = (codigoEscaneado) => {
        setDetectedCode(codigoEscaneado);
        setIsCodeDetected(true);
        console.log("Código de barras detectado:", codigoEscaneado);

        // Guardar el código detectado en el local storage
        localStorage.setItem("detectedCode", codigoEscaneado);

        setTimeout(() => setIsCodeDetected(false), 3000);
    };

    return (
        <div className="AppScanContainer">
            <h1>Scan <button onClick={() => navigate('/dashboard')}>Regresar a menú</button></h1>
            <div className="GridContainer">
                <div className="Column1">
                    {/* Integración del componente de escaneo con QuaggaJS */}
                    <ScanComponent onDetected={handleDetected} />
                </div>
                <div className="Column2">
                    <SaleComponent />
                    
                </div>
            </div>
            {/* {isCodeDetected ? (
                <p>Código de barras leído correctamente: {detectedCode}</p>
            ) : (
                detectedCode && <p>Código detectado: {detectedCode}</p>
            )} */}
        </div>
    );
}

export default AppScan;
