"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _hapi = _interopRequireDefault(require("@hapi/hapi"));

// eslint-disable-next-line import/no-unresolved
// require('dontenv').config();
_dotenv["default"].config();

var init = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var server;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            server = _hapi["default"].Server({
              port: process.env.PORT,
              host: process.env.HOST,
              routes: {
                cors: {
                  origin: ['*']
                }
              }
            });
            _context.next = 3;
            return server.start();

          case 3:
            // eslint-disable-next-line no-console
            console.log(" \uD83D\uDE80 Server berjalan pada ".concat(server.info.uri));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

init();
//# sourceMappingURL=server.js.map