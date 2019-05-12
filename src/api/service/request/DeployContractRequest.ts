import { TransactionRequest } from "./TransactionRequest";

export interface DeployContractRequest extends TransactionRequest {
  name: string,
  source: string,
  path: string
}
