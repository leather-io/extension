import { AnyContract, ContractRepository, DlcManager, offerMessageFromJson } from 'dlc-lib';
import { DlcAPI } from 'dlc-lib/src/interfaces';
import { NetworkType } from 'dlc-lib/src/types/networkTypes';

class BitcoinContractService implements DlcAPI {
  constructor(readonly dlcManager: DlcManager, readonly contractRepository: ContractRepository) {}

  getAllContracts(): Promise<AnyContract[]> {
    return this.contractRepository.getContracts();
  }

  processContractOffer(offer: string): Promise<AnyContract> {
    const offerMessage = offerMessageFromJson(offer);
    return this.dlcManager.onOfferMessage(offerMessage);
  }

  processContractSign(
    contractId: string,
    btcPrivateKey: string,
    counterpartyWalletUrl: string
  ): Promise<AnyContract> {
    return this.dlcManager.onSignMessage(contractId, btcPrivateKey, counterpartyWalletUrl);
  }

  getContract(contractId: string): Promise<AnyContract> {
    return this.contractRepository.getContract(contractId);
  }

  acceptContract(
    contractId: string,
    btcAddress: string,
    btcPublicKey: string,
    btcPrivateKey: string,
    btcNetwork: NetworkType
  ): Promise<AnyContract> {
    return this.dlcManager.acceptOffer(
      contractId,
      btcAddress,
      btcPublicKey,
      btcPrivateKey,
      btcNetwork
    );
  }

  rejectContract(contractId: string): Promise<AnyContract> {
    return this.dlcManager.onRejectContract(contractId);
  }
}

export default BitcoinContractService;
