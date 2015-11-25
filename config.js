var path = require('path'), config;

// Alamat URL Blog Ghost
// process.env.OPENSHIFT_APP_DNS
var ghost_url = 'http://www.ariss.id';

// Parameter Server SMTP
var smtp_host = 'smtp.mailgun.org', config;
var smtp_port = 465
var smtp_user = 'postmaster@kits.or.id';
var smtp_pass = '47agr9x2p963';

// Parameter CDN Cloudinary
var cdn_name = 'ariss';
var cdn_key  = '791177117251539';
var cdn_sec  = 'xxHlwY-gtFPk_z5_glkBsDwvAoI';

config = {
    development: {
        url: 'http://localhost:2368',
        database: { client: 'sqlite3', connection: { filename: path.join(__dirname, '/content/data/ghost-dev.db') }, debug: false },
        mail: {transport: 'SMTP', options: {host: smtp_host, port: smtp_port, auth: {user: smtp_user, pass: smtp_pass}}},
        server: { host: '127.0.0.1', port: '2368' }, paths: { contentPath: path.join(__dirname, '/content/') }
    },
    production: {
        url: ghost_url,
        database: { client: 'sqlite3', connection: { filename: '/usr/home/ariss/private/ghost-prod.db' }, debug: false },
        storage:  {active: 'cloudinary-store', 'cloudinary-store': {cloud_name: cdn_name, api_key: cdn_key, api_secret: cdn_sec}},
        mail: {transport: 'SMTP', options: {host: smtp_host, port: smtp_port, auth: {user: smtp_user, pass: smtp_pass}}},
        server: { host: '0.0.0.0', port: '2368' }, paths: { contentPath: path.join(__dirname, '/content/') }
    },
    prod_mysql: {
        url: ghost_url,
        database: {client: 'mysql', connection: {
            host     : 'localhost',
            port     : '3306',
            user     : 'root',
            password : 'toor',
            database : 'aris',
            charset  : 'utf8'
        }},
        storage:  {active: 'cloudinary-store', 'cloudinary-store': {cloud_name: cdn_name, api_key: cdn_key, api_secret: cdn_sec}},
        mail: {transport: 'SMTP', options: {host: smtp_host, port: smtp_port, auth: {user: smtp_user, pass: smtp_pass}}},
        server: {host: '0.0.0.0', port: '2368'}, paths: {contentPath: path.join(__dirname, '/content/')}
    },
    cloudpaas: {
        url: ghost_url,
        database: {client: 'mysql', connection: {
            host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
            port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
            user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
            password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
            database : process.env.OPENSHIFT_APP_NAME,
            charset  : 'utf8'
        }},
        storage:  {active: 'cloudinary-store', 'cloudinary-store': {cloud_name: cdn_name, api_key: cdn_key, api_secret: cdn_sec}},
        mail: {transport: 'SMTP', options: {host: smtp_host, port: smtp_port, auth: {user: smtp_user, pass: smtp_pass}}},
        server: {host: process.env.OPENSHIFT_NODEJS_IP, port: process.env.OPENSHIFT_NODEJS_PORT},
        paths: {contentPath: path.join(__dirname, '/content/')}
    }
};
module.exports = config;
