import pandas as pd
from prophet import Prophet
import json
import matplotlib.pyplot as plt

# Cargar historial de ventas
def cargar_historial_ventas():
    try:
        with open("historial_ventas.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        print("No se encontró el archivo de historial de ventas.")
        return []

# Cargar los datos de ventas
historial_ventas = cargar_historial_ventas()

# Convertir a DataFrame
data = pd.DataFrame(historial_ventas)

# Convertir la columna de fecha a datetime y renombrar columnas para Prophet
data['fecha_hora'] = pd.to_datetime(data['fecha_hora'])
data = data.rename(columns={'fecha_hora': 'ds', 'cantidad': 'y'})

# Filtrar los datos por cada producto y entrenar un modelo de Prophet
productos = data['codigo'].unique()
modelos = {}

for codigo in productos:
    print(f"Entrenando modelo para el producto con código: {codigo}")
    # Filtrar las ventas del producto específico
    df_producto = data[data['codigo'] == codigo][['ds', 'y']]
    
    # Verificar que haya suficientes datos
    if len(df_producto) < 2:
        print(f"Advertencia: No hay suficientes datos para el producto {codigo}. Omitiendo...")
        continue
    
    # Crear y ajustar el modelo Prophet
    modelo = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=False)
    modelo.fit(df_producto)
    
    # Guardar el modelo en el diccionario
    modelos[codigo] = modelo

    # Crear un DataFrame de fechas futuras para la predicción (por ejemplo, los próximos 30 días)
    futuro = modelo.make_future_dataframe(periods=30)
    
    # Predecir la demanda futura
    forecast = modelo.predict(futuro)
    
    # Mostrar predicciones
    print(f"Predicción de demanda para el producto {codigo}:")
    print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30))

    # Graficar la predicción
    modelo.plot(forecast)
    plt.title(f"Predicción de demanda para el producto {codigo}")
    plt.xlabel("Fecha")
    plt.ylabel("Cantidad Vendida")
    plt.show()