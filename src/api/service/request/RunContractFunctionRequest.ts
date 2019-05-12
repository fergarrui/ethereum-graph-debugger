export interface RunContractFunctionRequest {
  abi: any
  params: string[],
  from?: string,
  gas?: number,
  gasPrice?: number,
  value?: number
}
