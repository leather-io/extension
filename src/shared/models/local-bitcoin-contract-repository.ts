import {
    AnyContract,
    ContractQuery,
    ContractRepository,
    RepositoryError,
    ErrorCode,
    getId,
    ContractState,
  } from 'dlc-lib';
  
  const contractBucketTag = 'contractBucket';
  
  // This class implements the storage interfaces using the window's local storage.
  // eslint-disable-next-line
  class LocalBitcoinContractRepository implements ContractRepository {
    readonly _db: Storage;
  
    constructor() {
      this._db = window.localStorage; // eslint-disable-line no-underscore-dangle
    }
  
    createContract(contract: AnyContract): Promise<void> {
      return this.upsertValueInBucket(getId(contract), contract, contractBucketTag);
    }
  
    getContract(contractId: string): Promise<AnyContract> {
      return this.getValueOfType(contractId);
    }
  
    async getContracts(query?: ContractQuery | undefined): Promise<AnyContract[]> {
      const allValues: AnyContract[] = await this.getAllValuesInBucketOfType(contractBucketTag);
      if (!query) return allValues;
      return allValues.filter((x) => this.hasOneOfState(query.states, x));
    }
  
    async updateContract(contract: AnyContract): Promise<void> {
      if (contract.state === ContractState.Accepted) {
        await this.deleteInBucket(contract.temporaryContractId, contractBucketTag);
      }
      return this.upsertValueInBucket(getId(contract), contract, contractBucketTag);
    }
  
    deleteContract(contractId: string): Promise<void> {
      return this.deleteInBucket(contractId, contractBucketTag);
    }
  
    async hasContract(contractId: string): Promise<boolean> {
      const res = this._db.getItem(contractId); // eslint-disable-line no-underscore-dangle
      return Promise.resolve(res != null);
    }
  
    private async getBucketKeys(bucketTag: string): Promise<string[]> {
      const res = this._db.getItem(bucketTag); // eslint-disable-line no-underscore-dangle
      if (res != null) return res.split(',');
  
      return [];
    }
  
    private async upsertInBucket(key: string, value: string, bucketTag: string): Promise<void> {
      const keyList = await this.getBucketKeys(bucketTag);
  
      const index = keyList.indexOf(key);
  
      if (index === -1) {
        keyList.push(key);
        this._db.setItem(bucketTag, keyList.join(',')); // eslint-disable-line no-underscore-dangle
      }
  
      this._db.setItem(key, value); // eslint-disable-line no-underscore-dangle
      return Promise.resolve();
    }
  
    private async upsertValueInBucket<T>(key: string, value: T, bucketTag: string): Promise<void> {
      this.upsertInBucket(key, JSON.stringify(value), bucketTag);
    }
  
    private async deleteInBucket(key: string, bucketTag: string): Promise<void> {
      const keyList = await this.getBucketKeys(bucketTag);
      const index = keyList.indexOf(key);
      if (index === -1) {
        return;
      }
  
      keyList.splice(index, 1);
  
      if (keyList.length === 0) {
        this._db.removeItem(bucketTag); // eslint-disable-line no-underscore-dangle
      } else {
        this._db.setItem(bucketTag, keyList.join(',')); // eslint-disable-line no-underscore-dangle
      }
      this._db.removeItem(key); // eslint-disable-line no-underscore-dangle
      return Promise.resolve();
    }
  
    private async getAllKeyValuesInBucket(bucketTag: string): Promise<{
      [key: string]: string;
    }> {
      const keyList = await this.getBucketKeys(bucketTag);
      const ret: {
        [key: string]: string;
      } = {};
      for (const key of keyList) { 
        ret[key] = this._db.getItem(key);
      }
      return Promise.resolve(ret);
    }
  
    private async getAllValuesInBucket(bucketTag: string): Promise<string[]> {
      const keyValues = await this.getAllKeyValuesInBucket(bucketTag);
      const values: string[] = [];
      for (const obj in keyValues) {
        values.push(keyValues[obj]);
      }
  
      return values;
    }
  
    private async getAllValuesInBucketOfType<T>(bucketTag: string): Promise<T[]> {
      return (await this.getAllValuesInBucket(bucketTag)).map((x) => JSON.parse(x) as T);
    }
  
    private async getAllKeysInBucket(bucketTag: string): Promise<string[]> {
      const keyValues = await this.getAllKeyValuesInBucket(bucketTag);
      const keys: string[] = [];
      for (const key in keyValues) {
        keys.push(key);
      }
  
      return keys;
    }
  
    private async getValue(key: string): Promise<string> {
      const res = this._db.getItem(key); // eslint-disable-line no-underscore-dangle
      if (res != null) {
        return Promise.resolve(res);
      }
  
      throw new RepositoryError(ErrorCode.NotFound, 'Key not found in db');
    }
  
    private async getValueOfType<T>(key: string): Promise<T> {
      const str = await this.getValue(key);
      return JSON.parse(str);
    }
  
    private isMatch(contract: AnyContract, query: ContractQuery): boolean {
      return this.hasOneOfState(query.states, contract);
    }
  
    private hasOneOfState(states: ContractState[] | undefined, contract: AnyContract): boolean {
      return !states || states.includes(contract.state);
    }
  }
  
  export default LocalBitcoinContractRepository;
  