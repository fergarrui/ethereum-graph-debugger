import { TransactionRequest } from "./TransactionRequest";

export interface RunContractFunctionRequest extends TransactionRequest {
  abi: any
  params: string[]
  }
