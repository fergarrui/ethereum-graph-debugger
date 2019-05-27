/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './inversify/ioc';
import { DebuggerController } from './api/service/controller/DebuggerController';
import { FileController } from './api/service/controller/FileController';
import { DisassembleController } from './api/service/controller/DisassembleController';
import { TransactionController } from './api/service/controller/TransactionController';
import { ControlFlowGraphController } from './api/service/controller/ControlFlowGraphController';
import { StorageRecoverController } from './api/service/controller/StorageRecoverController';
import { ContractController } from './api/service/controller/ContractController';
import { SolcController } from './api/service/controller/SolcController';
import * as express from 'express';

const models: TsoaRoute.Models = {
    "Opcode": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "opcode": { "dataType": "double", "required": true },
            "parameters": { "dataType": "double", "required": true },
        },
    },
    "OperationResponse": {
        "properties": {
            "offset": { "dataType": "double", "required": true },
            "opcode": { "ref": "Opcode", "required": true },
            "argument": { "dataType": "string", "required": true },
            "begin": { "dataType": "double" },
            "end": { "dataType": "double" },
        },
    },
    "TraceResponse": {
        "properties": {
            "cfg": { "dataType": "string", "required": true },
            "operations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
            "trace": { "dataType": "any", "required": true },
        },
    },
    "StringBodyRequest": {
        "properties": {
            "request": { "dataType": "string", "required": true },
        },
    },
    "ContractFile": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "path": { "dataType": "string", "required": true },
        },
    },
    "DisassembledContractResponse": {
        "properties": {
            "hasConstructor": { "dataType": "boolean", "required": true },
            "constructorOperations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
            "runtimeOperations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
            "bytecode": { "dataType": "string", "required": true },
        },
    },
    "TransactionReceipt": {
        "properties": {
            "transactionHash": { "dataType": "string", "required": true },
            "data": { "dataType": "string", "required": true },
            "to": { "dataType": "string", "required": true },
            "from": { "dataType": "string", "required": true },
            "blockNumber": { "dataType": "double", "required": true },
            "transactionIndex": { "dataType": "double", "required": true },
            "contractAddress": { "dataType": "string", "required": true },
        },
    },
    "GFCResponse": {
        "properties": {
            "cfg": { "dataType": "string", "required": true },
            "operations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
        },
    },
    "Storage": {
        "properties": {
            "storage": { "dataType": "any", "default": {} },
        },
    },
    "DeployContractRequest": {
        "properties": {
            "from": { "dataType": "string" },
            "gas": { "dataType": "double" },
            "gasPrice": { "dataType": "double" },
            "value": { "dataType": "double" },
            "blockchainHost": { "dataType": "string" },
            "blockchainProtocol": { "dataType": "string" },
            "blockchainBasicAuthUsername": { "dataType": "string" },
            "blockchainBasicAuthPassword": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "source": { "dataType": "string", "required": true },
            "path": { "dataType": "string", "required": true },
        },
    },
    "RunContractFunctionRequest": {
        "properties": {
            "from": { "dataType": "string" },
            "gas": { "dataType": "double" },
            "gasPrice": { "dataType": "double" },
            "value": { "dataType": "double" },
            "blockchainHost": { "dataType": "string" },
            "blockchainProtocol": { "dataType": "string" },
            "blockchainBasicAuthUsername": { "dataType": "string" },
            "blockchainBasicAuthPassword": { "dataType": "string" },
            "abi": { "dataType": "any", "required": true },
            "params": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "SolcChangeVersionRequest": {
        "properties": {
            "version": { "dataType": "string", "required": true },
        },
    },
};
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
    app.post('/debug/:tx',
        function(request: any, response: any, next: any) {
            const args = {
                tx: { "in": "path", "name": "tx", "required": true, "dataType": "string" },
                source: { "in": "body", "name": "source", "required": true, "ref": "StringBodyRequest" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
                blockchainHost: { "in": "query", "name": "blockchainHost", "dataType": "string" },
                blockchainProtocol: { "in": "query", "name": "blockchainProtocol", "dataType": "string" },
                blockchainBasicAuthUsername: { "in": "query", "name": "blockchainBasicAuthUsername", "dataType": "string" },
                blockchainBasicAuthPassword: { "in": "query", "name": "blockchainBasicAuthPassword", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<DebuggerController>(DebuggerController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.debug.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/files/:dir',
        function(request: any, response: any, next: any) {
            const args = {
                dir: { "in": "path", "name": "dir", "required": true, "dataType": "string" },
                extension: { "in": "query", "name": "extension", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<FileController>(FileController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.findContractsInDir.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/disassemble',
        function(request: any, response: any, next: any) {
            const args = {
                source: { "in": "body", "name": "source", "required": true, "ref": "StringBodyRequest" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<DisassembleController>(DisassembleController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.disassembleSourceCode.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/tx/:tx/receipt',
        function(request: any, response: any, next: any) {
            const args = {
                tx: { "in": "path", "name": "tx", "required": true, "dataType": "string" },
                blockchainHost: { "in": "query", "name": "blockchainHost", "dataType": "string" },
                blockchainProtocol: { "in": "query", "name": "blockchainProtocol", "dataType": "string" },
                blockchainBasicAuthUsername: { "in": "query", "name": "blockchainBasicAuthUsername", "dataType": "string" },
                blockchainBasicAuthPassword: { "in": "query", "name": "blockchainBasicAuthPassword", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<TransactionController>(TransactionController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getReceipt.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/cfg/source',
        function(request: any, response: any, next: any) {
            const args = {
                source: { "in": "body", "name": "source", "required": true, "ref": "StringBodyRequest" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
                constructor: { "in": "query", "name": "constructor", "dataType": "boolean" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ControlFlowGraphController>(ControlFlowGraphController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getCFGFromSource.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/cfg/bytecode',
        function(request: any, response: any, next: any) {
            const args = {
                bytecode: { "in": "body", "name": "bytecode", "required": true, "ref": "StringBodyRequest" },
                constructor: { "in": "query", "name": "constructor", "dataType": "boolean" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ControlFlowGraphController>(ControlFlowGraphController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getCFGFromBytecode.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/storage/:contractAddress',
        function(request: any, response: any, next: any) {
            const args = {
                contractAddress: { "in": "path", "name": "contractAddress", "required": true, "dataType": "string" },
                startBlock: { "in": "query", "name": "startBlock", "required": true, "dataType": "double" },
                endBlock: { "in": "query", "name": "endBlock", "required": true, "dataType": "double" },
                blockchainHost: { "in": "query", "name": "blockchainHost", "dataType": "string" },
                blockchainProtocol: { "in": "query", "name": "blockchainProtocol", "dataType": "string" },
                blockchainBasicAuthUsername: { "in": "query", "name": "blockchainBasicAuthUsername", "dataType": "string" },
                blockchainBasicAuthPassword: { "in": "query", "name": "blockchainBasicAuthPassword", "dataType": "string" },
                existingStorage: { "in": "query", "name": "existingStorage", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<StorageRecoverController>(StorageRecoverController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getStorage.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/contract/abi',
        function(request: any, response: any, next: any) {
            const args = {
                source: { "in": "query", "name": "source", "required": true, "dataType": "string" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ContractController>(ContractController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAbi.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/contract/deploy',
        function(request: any, response: any, next: any) {
            const args = {
                deployRequest: { "in": "body", "name": "deployRequest", "required": true, "ref": "DeployContractRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ContractController>(ContractController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.deploy.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/contract/run/:contractAddress',
        function(request: any, response: any, next: any) {
            const args = {
                contractAddress: { "in": "path", "name": "contractAddress", "required": true, "dataType": "string" },
                runFunction: { "in": "body", "name": "runFunction", "required": true, "ref": "RunContractFunctionRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ContractController>(ContractController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.run.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/solc',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SolcController>(SolcController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getVersion.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/solc/list',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SolcController>(SolcController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAvailableVersions.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/solc',
        function(request: any, response: any, next: any) {
            const args = {
                solcChangeVersionRequest: { "in": "body", "name": "solcChangeVersionRequest", "required": true, "ref": "SolcChangeVersionRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SolcController>(SolcController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.changeVersion.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });


    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
