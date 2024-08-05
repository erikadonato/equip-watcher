# Equipments Watcher

Project developed to monitor, store, modify, and save data from the equipment sensors.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/erikadonato/equip-watcher
   cd equip-watcher 

2. Install the dependencies:
   ```bash
   $ cd frontend
   $ yarn install
   $ cd .. 
   $ cd backend
   $ yarn install

## Configuration

The database configuration is located in the file equip-watcher/backend/src/database/typeorm-config.service. The API uses SQLite as the database.


## Execution

- To start both frontend and backend simultaneously, ensure you are at the root of the equip-watcher folder:

   ```bash
   $ yarn start

The API will be running at http://localhost:3001.
The frontend will be running at http://localhost:3000.

## Endpoints

# Save Equipment Data
- URL: `/equip/save`
- Method: `POST`
- Description: Saves equipment data to the database.
- Request Body:
    - equipmentId (string, required): The ID of the equipment.
    - timestamp (Date, optional): The timestamp of the recorded data.
    - value (number, optional): The recorded value of the equipment data.

# Search Equipment Data

- URL: `/equip/search`
- Method: `GET`
- Description: Searches for equipment data based on query parameters.
- Query Parameters:
    - id (UUID, optional): The unique identifier of the record.
    - equipmentId (string, optional): The ID of the equipment.
    - initialDate (Date, optional): The start date for the search range.
    - finalDate (Date, optional): The end date for the search range.

# Upload CSV File
- URL: `/equip/upload`
- Method: `POST`
- Description: Uploads a CSV file to update equipment data.
- Request Body:
    - file (file, required): The CSV file containing equipment data.

## Tests

- To run the tests, which are only on the backend, ensure you are at the root of the equip-watcher folder:
    ```bash
   $ cd backend
   $ yarn test
