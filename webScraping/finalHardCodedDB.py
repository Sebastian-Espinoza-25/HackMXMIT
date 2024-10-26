# from flask import Flask, request, jsonify
# import requests
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# # Predefined product data based on GTIN
# product_data = {
#     "7501000630363": {
#         "GTIN": "7501000630363",
#         "brand": "GAMESA",
#         "product_name": "MINI MAMUT",
#         "product_description": "MINI MAMUT GAMESA GALLETA CON MALVAVISCO COBERTURA SABOR CHOCOLATE 12 G",
#         "volume": ".012"
#     },
#     "7502271911472": {
#         "GTIN": "7502271911472",
#         "brand": "MARS",
#         "product_name": "MARS M&MS CACAHUATE 44.3G",
#         "product_description": "CHOCOLATE CON LECHE CONFITADOS CON CACAHUATE 44.3G",
#         "volume": ".0443"
#     },
#     "7501011130272": {
#         "GTIN": "7501011130272",
#         "brand": "DORITOS",
#         "product_name": "DORITOS",
#         "product_description": "DORITOS TOTOPOS DE MAÍZ XTRA FLAMIN' HOT 62 GRM",
#         "volume": ".062"
#     }
# }

# # Endpoint to receive GTIN and process data
# @app.route('/process-gtin', methods=['POST'])
# def process_gtin():
#     data = request.get_json()
#     gtin = data.get('GTIN')

#     # Check if GTIN is provided
#     if not gtin:
#         return jsonify({"error": "No GTIN provided"}), 400

#     # Look up the product information based on GTIN
#     product_info = product_data.get(gtin)
#     if not product_info:
#         return jsonify({"error": "GTIN not found"}), 404

#     # Define the target URL for sending product data
#     target_url = "http://127.0.0.1:5001/receive-data"  # Replace with actual target endpoint

#     # Send the product data to the target server
#     try:
#         response = requests.post(target_url, json=product_info)
#         if response.status_code == 200:
#             return jsonify({"message": "Data sent successfully", "product_data": product_info}), 200
#         else: 
#             return jsonify({"error": "Failed to send data", "status_code": response.status_code}), 500
#     except requests.RequestException as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Predefined product data based on GTIN
product_data = {
    "7501000630363": {
        "GTIN": "7501000630363",
        "brand": "GAMESA",
        "product_name": "MINI MAMUT",
        "product_description": "MINI MAMUT GAMESA GALLETA CON MALVAVISCO COBERTURA SABOR CHOCOLATE 12 G",
        "volume": ".012"
    },
    "7502271911472": {
        "GTIN": "7502271911472",
        "brand": "MARS",
        "product_name": "MARS M&MS CACAHUATE 44.3G",
        "product_description": "CHOCOLATE CON LECHE CONFITADOS CON CACAHUATE 44.3G",
        "volume": ".0443"
    },
    "7501011130272": {
        "GTIN": "7501011130272",
        "brand": "DORITOS",
        "product_name": "DORITOS",
        "product_description": "DORITOS TOTOPOS DE MAÍZ XTRA FLAMIN' HOT 62 GRM",
        "volume": ".062"
    }
}

# Endpoint to receive GTIN and return the corresponding product data
@app.route('/process-gtin', methods=['POST'])
def process_gtin():
    data = request.get_json()
    gtin = data.get('GTIN')

    # Check if GTIN is provided
    if not gtin:
        return jsonify({"error": "No GTIN provided"}), 400

    # Look up the product information based on GTIN
    product_info = product_data.get(gtin)
    if not product_info:
        return jsonify({"error": "GTIN not found"}), 404

    # Return the product information
    return jsonify({"message": "Product data found", "product_data": product_info}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
