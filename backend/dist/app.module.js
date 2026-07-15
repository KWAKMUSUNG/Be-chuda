"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const diagnostic_module_1 = require("./diagnostic/diagnostic.module");
const diagnostic_log_entity_1 = require("./diagnostic/entities/diagnostic-log.entity");
const leak_database_entity_1 = require("./diagnostic/entities/leak-database.entity");
const vulnerability_template_entity_1 = require("./diagnostic/entities/vulnerability-template.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mariadb',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'your_password',
                database: 'be_chuda_db',
                entities: [diagnostic_log_entity_1.DiagnosticLog, leak_database_entity_1.LeakDatabase, vulnerability_template_entity_1.VulnerabilityTemplate],
                synchronize: true,
            }),
            diagnostic_module_1.DiagnosticModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map