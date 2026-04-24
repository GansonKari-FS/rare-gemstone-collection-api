# Geospatial Data API

## Overview
This project is a Node.js API that fetches geospatial data from an external API and stores it in MongoDB.

## Features
- Fetch geospatial data using latitude and longitude
- Store data in MongoDB
- Retrieve all stored data
- Retrieve data by ID

## API Routes

### GET /api/geo-data
Fetch data from external API using query params:
?lat=30.6954&lon=-91.744

### POST /api/geo-data
Save geospatial data to MongoDB

### GET /api/geo-data/all
Retrieve all saved data

### GET /api/geo-data/:id
Retrieve a single entry by ID

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose

## How to Run
npm install  
npm run dev
