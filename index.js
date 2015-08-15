'use strict';

/*
 *  ______                     _________
 *  ___  /_____________ _____________  /
 *  __  __ \  __ \  __ `/_  ___/  __  /
 *  _  /_/ / /_/ / /_/ /_  /   / /_/ /
 *  /_.___/\____/\__,_/ /_/    \__,_/
 *      a minimalist dashboard and monitoring solution.
 *
 * This program is distributed under the terms of the MIT license.
 * Please see `LICENSE.md` file for details.
 *
 * Send your comments and suggestions to…
 * <https://github.com/v0lkan/board/issues>
 */

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _fs = require('fs');

var _path = require('path');

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _boardQueue = require('board.queue');

var _boardLog = require('board.log');

var _boardLog2 = _interopRequireDefault(_boardLog);

var OK = 'OK';
var HTTP_SUCCESS = 200;
var IO_PORT = 4242;

var server = (0, _http.createServer)();
var io = (0, _socketIo2['default'])(server);

server.listen(IO_PORT);

var namespaces = {};

var noop = function noop() {};

var createChannel = function createChannel(channel) {
    namespaces[channel] = io.of('/' + channel);
};

var _init = function init(channels) {
    channels.forEach(function (channel) {
        return createChannel(channel);
    });

    (0, _boardQueue.createPullSocket)(function (data) {
        if (!data) {
            return;
        }

        var parsed = JSON.parse(data.toString());
        var target = parsed.target;

        if (!target) {
            return;
        }

        if (namespaces[target]) {
            (0, _boardLog2['default'])('Emitting data for "' + target + '"');

            namespaces[target].emit('board', data.toString());
        }
    });

    // init is like a constructor function; or "like" a static initializer;
    // therefore it should be called only once.
    _init = noop;
};

// TODO: notify user when navigating to a board url and the board is missing.

exports.init = _init;

//# sourceMappingURL=index.js.map