# Gullak Backend Engine — Personal Expense Tracker API

A production-ready, secure, and multi-tenant RESTful API built to power a personal expense tracker application. This backend leverages Node.js and Express to deliver secure transaction tracking, automated financial analytics, and custom category management, while completely insulating user data at the database level.

### 🚀 Live URL & Interactive Dashboard

- **Production API Base URL:** `https://gullak-beta.vercel.app`
- **Interactive Swagger Documentation:** `https://gullak-beta.vercel.app/docs/`
  _(The entire API can be evaluated, authorized, and tested live directly through the Swagger web console without inspecting source code files)._

---

## 🛠️ Tech Stack & Justification

- **Runtime & Framework:** **Node.js** with **Express.js**. Chosen for its asynchronous, non-blocking, event-driven I/O model, rapid prototyping capabilities, and mature ecosystem supporting robust middleware deployment.
- **Database:** **MongoDB Atlas** (Cloud NoSQL Cluster) with **Mongoose ODM**. Selected due to its flexible document design, making transactional data models easily extensible. MongoDB's powerful aggregation pipeline allows for efficient calculation of real-time multi-month summaries and categorical spending percentages.
- **Authentication:** Custom stateless **JSON Web Tokens (JWT)** using `jsonwebtoken` and `bcryptjs` for secure password hashing. Implementing a custom auth layer eliminates reliance on third-party pricing tiers or external authentication infrastructure.
- **Documentation Configuration:** Built using native `swagger-jsdoc` and `swagger-ui-express`, with assets served via global CDNs to optimize caching and rendering performance within serverless runtimes.

---

## 🔒 Security Baseline & Architecture Assumptions

1. **Multi-Tenant Privacy Bounds:** Data-level authorization is strictly enforced across all CRUD operations. Every transaction and custom category model retains an owner reference (`userId`). Database queries explicitly match the user ID parsed from the incoming JWT payload, preventing any vector for cross-user data access.
2. **Serverless Engine Synchronization:** To accommodate Vercel's stateless serverless function lifecycle, global Mongoose command buffering has been disabled (`bufferCommands = false`). An advanced async polling connection middleware has been built into the lifecycle guard to handle container cold starts, ensuring database sockets are fully authenticated (`readyState === 1`) before route controllers execute.
3. **Endpoint Rate Limiting:** Security-critical authentication paths are guarded against brute-force attacks via `express-rate-limit`. The application configuration explicitly trusts Vercel's proxy layers (`trust proxy = 1`) to accurately parse upstream client IPs.

---

## ⚙️ Local Setup & Configuration

Follow these steps to configure and run the engine locally on your machine:

### 1. Environment Configurations

Create a `.env` file in the root directory of your project folder and define the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_custom_secure_jwt_string_key
JWT_EXPIRES_IN=1d
```
