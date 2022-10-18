const db = require('./db/db');
const app = require('./app');

const PORT = 5000;

db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
});
