const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static(path.join(__dirname, 'build')));

// User portion

const userAuthRoutes = require('./routes/user/authRoutes');
const userProductRoutes = require('./routes/user/productRoutes');
const userPromotionRoutes = require('./routes/user/promotionRoutes');
const userOrderRoutes = require('./routes/user/orderRoutes');

app.use('/api/user/auth', userAuthRoutes);
app.use('/api/user/product', userProductRoutes);
app.use('/api/user/promotion', userPromotionRoutes);
app.use('/api/user/order', userOrderRoutes);

// Admin portion

const adminAuthRoutes = require('./routes/admin/authRoutes');
const adminPromotionRoutes = require('./routes/admin/promotionRoutes');
const adminProductRoutes = require('./routes/admin/productRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/promotion', adminPromotionRoutes);
app.use('/api/admin/product', adminProductRoutes);
app.use('/api/admin/order', adminOrderRoutes);

// Common portion

const photoRoutes = require('./routes/common/photoRoutes');

app.use('/api/common/photo', photoRoutes);

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

module.exports = app;
