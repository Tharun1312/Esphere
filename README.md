# Esphere – Smart Real Estate Marketplace

Esphere is a full‑stack real estate marketplace that connects buyers and sellers through a secure, transparent, and modern web platform. It focuses on smooth property discovery, clear listing details, and a robust backend that can be extended with features like verification and fraud prevention.[web:1][file:16]

## Features

- Property listing with key details such as price, location, and description.  
- Buyer view for browsing, searching, and viewing property details.  
- Seller flow to add and manage property listings.  
- Responsive UI for a clean and simple user experience.  
- Future scope: Integrate a blockchain layer for tamper‑proof ownership records and add advanced verification workflows to reduce fraud and increase transparency in property transactions.[file:16]

## Tech Stack

- **Frontend:** React, JavaScript, CSS, HTML  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Version Control:** Git, GitHub  

These technologies are chosen to build a scalable, maintainable, and easily deployable MERN‑style application.[web:1][file:16]

## Project Structure

- `client/` – React frontend (components, pages, routing, API calls).  
- `server/` – Node.js/Express backend (routes, controllers, database models, configuration).  

This separation keeps UI and API concerns clean and makes it easier to develop and deploy both sides independently.[web:1]

## Getting Started

### Prerequisites

- Node.js and npm installed  
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)  
- Git for cloning the repository  

### Installation

1. Clone the repository:
git clone https://github.com/Tharun1312/Esphere.git
cd Esphere


2. Install frontend dependencies:
cd client
npm install


3. Install backend dependencies:
cd ../server
npm install



### Configuration

- In the `server` folder, create a `.env` file with values such as:
- `MONGO_URI` – MongoDB connection string  
- `PORT` – Server port (for example, 5000)  

Adjust the names to match your actual config files and variables.

### Running the app

From the project root, run frontend and backend in separate terminals:

- Backend:
cd server
npm start


- Frontend:
cd client
npm start



Then open the URL shown in the terminal (usually `http://localhost:3000`) in your browser.

## Future Enhancements

- User authentication and role‑based access (buyer/seller/admin).  
- Property verification workflows and fraud detection.  
- Integration with a blockchain layer for tamper‑proof ownership and transaction history.  
- Search filters, maps, and advanced recommendation features.  

## Author

**Tharun Chinthala**  
- B.Tech Computer Science, SR University  
- Interests: full‑stack development, blockchain, and applied machine learning.[file:16]
