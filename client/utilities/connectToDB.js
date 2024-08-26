import mongoose from 'mongoose';

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to MongoDB');
    }
    catch (error) {
        console.error('error connecting to MongoDB:', error.toString());
    }
}

export default connectToMongo;