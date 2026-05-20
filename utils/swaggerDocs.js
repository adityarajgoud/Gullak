/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: User registration, authentication, and profile settings
 *   - name: Categories
 *     description: Default and personalized custom financial categories
 *   - name: Transactions
 *     description: Expense and Income transaction ledger entries
 *   - name: Analytics
 *     description: Financial aggregations and mathematical breakdown tracking
 */

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new system user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "secure123", minLength: 6 }
 *     responses:
 *       201: { description: User created successfully and token distributed }
 *       400: { description: Validation failure or user already exists }
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user credentials and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "secure123" }
 *     responses:
 *       200: { description: Authenticated successfully }
 *       401: { description: Invalid credentials provided }
 *
 * /api/v1/auth/profile:
 *   get:
 *     summary: Retrieve currently logged-in user profile metrics
 *     tags: [Auth]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Profile returned successfully }
 *       401: { description: Missing or invalid authentication token }
 *   put:
 *     summary: Update profile identifiers
 *     tags: [Auth]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Johnathan Doe" }
 *               email: { type: string, example: "johnnew@example.com" }
 *     responses:
 *       200: { description: Profile updated successfully }
 *
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change user password strings
 *     tags: [Auth]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string, example: "secure123" }
 *               newPassword: { type: string, example: "newSecure456", minLength: 6 }
 *     responses:
 *       200: { description: Password modified successfully }
 *       400: { description: Current password verification mismatch }
 *
 * /api/v1/categories:
 *   get:
 *     summary: Fetch system default and user-created custom categories
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Array listing of all accessible categories }
 *   post:
 *     summary: Provision a unique custom category
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Gym Subscription" }
 *     responses:
 *       201: { description: Custom category logged }
 *       400: { description: Category collision with default name structures }
 *
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Modify a custom category label
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Fitness Club" }
 *     responses:
 *       200: { description: Category title rewritten }
 *       404: { description: Target custom document missing or boundary unauthorized }
 *   delete:
 *     summary: Remove a personalized custom category document reference
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category reference deleted successfully }
 *       404: { description: Targeted record missing or protected from extraction }
 *
 * /api/v1/transactions:
 *   post:
 *     summary: Create an income or expense transaction ledger record
 *     tags: [Transactions]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, category]
 *             properties:
 *               type: { type: string, enum: [income, expense], example: "expense" }
 *               amount: { type: number, example: 45.50 }
 *               category: { type: string, example: "Food" }
 *               date: { type: string, format: date, example: "2026-05-20" }
 *               note: { type: string, example: "Grocery shopping trip" }
 *     responses:
 *       201: { description: Transaction entry built successfully }
 *   get:
 *     summary: Retrieve multi-tenant transactional accounts matching key pagination filters
 *     tags: [Transactions]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [income, expense] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [date, amount], default: "date" }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: "desc" }
 *     responses:
 *       200: { description: Structural JSON array object with pagination metadata block }
 *
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Fetch single transaction by unique ID
 *     tags: [Transactions]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Transaction payload isolated }
 *       404: { description: Entry missing or blocked by cross-user privacy boundaries }
 *   put:
 *     summary: Modify transaction particulars
 *     tags: [Transactions]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number, example: 55.00 }
 *               note: { type: string, example: "Adjusted item tracking cost total" }
 *     responses:
 *       200: { description: Target items updated }
 *       404: { description: Document index missing }
 *   delete:
 *     summary: Void transaction ledger record line
 *     tags: [Transactions]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Transaction document removed }
 *       404: { description: Target identifier unavailable }
 *
 * /api/v1/analytics/summary:
 *   get:
 *     summary: Fetch aggregate balance summary parameters across configured periods
 *     tags: [Analytics]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Returns totalIncome, totalExpenses, and unified netBalance numbers }
 *
 * /api/v1/analytics/breakdown:
 *   get:
 *     summary: Categorical expense percentage contributions report mapping
 *     tags: [Analytics]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Array listing of costs grouped under name tags with active math scales }
 *
 * /api/v1/analytics/month-over-month:
 *   get:
 *     summary: Comparative tracking matrices mapping monthly cycles chronologically
 *     tags: [Analytics]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, default: 6 }
 *     responses:
 *       200: { description: Matrix breakdown of relative monthly cash in/out charts }
 */
