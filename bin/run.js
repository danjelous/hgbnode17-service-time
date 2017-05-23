'use strict';

const http = require('http');
const request = require('superagent');
const config = require('../config');
const log = config.log();
const service = require('../server/service')(config);
const server = http.createServer(service);
server.listen();

server.on('listening', function() {
    log.info(`Weather Service is listening on ${server.address().port} in ${service.get('env')} mode`);

    const mainUrl = 'http://127.0.0.1:3000';

    const announce = () => {
        request.put(`${mainUrl}/service/weather/${server.address().port}`)
        .end((err) => {
            if(err) log.error(err);
        })
    }

    announce();
    setInterval(announce, 20 * 1000);

});