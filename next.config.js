if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname + '/.env.production'});
} else if (process.env.NODE_ENV !== 'development')  {
  require('dotenv').config({path: __dirname + '/.env.development'});
}

console.log(`next.config.js`);
console.log(`NODE_ENV===${process.env.NODE_ENV}`);

module.exports = {
  env: {
    NEXT_PUBLIC_CONTRACT_DEFAULT_OS_FACTORY_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_DEFAULT_OS_FACTORY_ADDRESS,
    SUBGRAPH_URI: process.env.SUBGRAPH_URI,    
  }
}