## bar-stats

### Developed At Alchemy Code Lab
* Easton (easton-john)
* Kevin (grayson073)
* Carmen (carmenvramos)

### Overview:

Assumptions for app environment/project:
* Payment application tied to bar/restaurant POS system (assume POS technology exists)
* User(s) can pay at table, find participating businesses
* Business owner(s) can identify "premium" customers (statistics on order/spend history)
* Premium users could then be sent specific promotions, event invites, etc.
* Potential: Developers/super users can glean overall data for market or stats for select businesses

### Features
Basic CRUDs for Users, Bars, and Sales
User Authentication

 **API Routes**
 *     /api/auth/signup (POST) - Signs up a user, generates token
 *     /api/auth/signin (POST) - Signs in a user, generates token
 *     /api/auth/verify (GET) - Verifies token
 *     /api/users/ (GET) - Gets list of users
 *     /api/users/<USER ID> - (GET) - Get user by id
 *     /api/users/<USER ID> - (PUT) - Updates user
 *     /api/users/<USER ID> - (DELETE) - Deletes a user
 *     /api/bars/ (POST) - Adds a bar
 *     /api/bars/ (GET) - Gets a list of bars
 *     /api/bars/<BAR ID> - (GET) - Gets a bar by id
 *     /api/bars/<BAR ID> - (PUT) - Updates a bar
 *     /api/bars/<BAR ID> - (DELETE) - Deletes a bar
 *     /api/sales/ (POST) - Creates a sale
 *     /api/sales/ (GET) - Gets a list of sales by bar
 *     /api/sales/revenue-by-owner (GET) - Gets total revenue for owner (all bars)
 *     /api/sales/premium-customers/<BAR ID> - Gets sales by customer for a bar
 *     /api/sales/bar-revenue/<BAR ID> - Gets total sales for owner's specific bar
 *     /api/admin/sales-by-bar (GET) - Gets total sales for all bars (high-level) with drink/food quantity
 *     /api/owner/sales-by-bar (GET) - Gets total sales for all bars (owner only) with drink/food quantity
 *     /api/sales/<BAR ID> (GET) - Gets all sales tickets for a single bar with drink/food quantity
 *     /api/sales/<SALES ID> (PUT) - Updates a specific sale/ticket
 *     /api/sales/<SALES ID> - (DELETE) Deletes a specific sale/ticket
 
 **Installation**
$ npm -
Wire up Mongo database
See env.example for keys/secret

 **MongoDB Collections**
 * Users
 * Bars
 * Sales
 
**Dev Dependencies**
* chai
* chai-http
* esLint
* mocha
* nodemon
* morgan

**Dependencies**
* bcryptjs
* dotenv
* express
* jsonwebtoken
* mongoose
 
 **Middleware**
 * ensureAuth (token via JSON web tokens)
 * ensure<role> (defaults are 'customer', 'owner', 'admin')
 * Most routes require a token, some require specific roles included in User schema
 
