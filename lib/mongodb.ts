import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, defina a variável MONGODB_URI no arquivo .env.local'
  );
}

// Definir uma tipagem mais simples para o cache
interface CachedConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Escopo global para o cache
const globalMongo = global as unknown as {
  mongoose?: CachedConnection;
};

// Usar valor existente ou inicializar
const cached: CachedConnection = globalMongo.mongoose || { 
  conn: null, 
  promise: null 
};

// Armazenar no escopo global
if (!globalMongo.mongoose) {
  globalMongo.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 