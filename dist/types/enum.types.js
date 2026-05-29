"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Only_Admins = exports.Only_Users = exports.All_Users = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
exports.All_Users = Object.values(Role);
exports.Only_Users = [Role.USER];
exports.Only_Admins = [Role.ADMIN, Role.SUPER_ADMIN];
//object.values(obj)
