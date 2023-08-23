import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './src/routes/userRouter.js';
import productRouter from './src/routes/productRouter.js';
import connection from './src/database/connection.js';
import cookieParser from 'cookie-parser';
import AppError from './src/util/appError.js';
const app = express();
dotenv.config();

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
//config file upload
// app.use(fileUpload({ createParentPath: true }));
//config req.body
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.headers);
	next();
});

// const limiter = rateLimit({
// 	windowMs: process.env.RATE_LIMIT_TIME * 60 * 1000, // x minutes
// 	max: process.env.RATE_LIMIT_MAX, // Limit each IP to 100 requests per `window` (here, per/ x minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// 	message: `You only could send ${process.env.RATE_LIMIT_MAX} request per ${process.env.RATE_LIMIT_TIME} minutes, please try again later`,
// 	handler: (request, response, next, options) => {
// 		// Trả về một JSON response chứa thông báo lỗi
// 		response.status(options.statusCode).json({ statusCode: options.statusCode, error: options.message });
// 	},
// });

// // Apply the rate limiting middleware to all requests
// app.use(limiter);
//khai báo route
app.use('/api', userRouter);
app.use('/api/product', productRouter);
// Check route
app.all('*', (req, res, next) => {
	// res.status(404).json({
	// 	status: 'failed',
	// 	message: `Can't find ${req.originalUrl} on this server`,
	// });
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

(async () => {
	try {
		// test connection
		await connection();

		// // Using mongodb driver
		// const url = process.env.DB_HOST_WITH_DRIVER;
		// const dbName = process.env.DB_NAME;
		// const client = new MongoClient(url);
		// await client.connect();
		// console.log('Connected successfully to server');
		// const db = client.db(dbName);
		// const collection = db.collection('documents');
		app.listen(port, hostname, () => {
			console.log('ok port', port);
		});
	} catch (error) {
		console.log('>>>Error connec to DB:', error);
	}
})();
