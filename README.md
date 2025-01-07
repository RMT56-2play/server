# 2play server

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/RMT56-2play/server.git

   ```

2. **Install dependencies**

   ```sh
   # For the Backend:

   cd server
   npm install
   ```

3. **Setup Database Postgres**

   ```sh
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

## Access the application

- Backend: http://localhost:3000

  ```sh
  npm run dev
  ```
