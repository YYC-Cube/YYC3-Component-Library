import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import {
  SmartContract,
  Party,
  ContractTerm,
  ContractStatus,
  PartyRole,
  AuditLog,
  ContractMetadata,
  ContractCategory
} from '../types/index.js';

export class ContractManager {
  private contracts: Map<string, SmartContract> = new Map();
  private auditLogs: AuditLog[] = [];
  private encryptionKey: string;

  constructor(encryptionKey?: string) {
    this.encryptionKey = encryptionKey || this.generateEncryptionKey();
  }

  /**
   * 创建新合约
   */
  async createContract(
    name: string,
    description: string,
    category: ContractCategory,
    creatorId: string,
    creatorRole: PartyRole,
    metadata: Partial<ContractMetadata> = {}
  ): Promise<SmartContract> {
    const contractId = uuidv4();
    const now = new Date();

    const contract: SmartContract = {
      id: contractId,
      name,
      description,
      version: '1.0.0',
      status: ContractStatus.DRAFT,
      parties: [{
        id: creatorId,
        name: creatorId, // 在实际应用中应该从用户系统获取
        role: creatorRole,
        address: creatorId, // 在实际应用中应该是钱包地址
        reputation: 100,
        joinedAt: now,
        lastActive: now
      }],
      terms: [],
      metadata: {
        category,
        tags: [],
        language: 'zh-CN',
        childContractIds: [],
        ...metadata
      },
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(contractId, contract);
    await this.logAudit(contractId, 'CONTRACT_CREATED', creatorId, null, null, { name, category });

    return contract;
  }

  /**
   * 添加协作方到合约
   */
  async addPartyToContract(
    contractId: string,
    party: Omit<Party, 'joinedAt' | 'lastActive'>,
    addedBy: string
  ): Promise<void> {
    const contract = this.getContract(contractId);

    if (contract.status !== ContractStatus.DRAFT &&
        contract.status !== ContractStatus.PENDING_SIGNATURE) {
      throw new Error('无法添加协作方到当前状态的合约');
    }

    const newParty: Party = {
      ...party,
      joinedAt: new Date(),
      lastActive: new Date()
    };

    contract.parties.push(newParty);
    contract.updatedAt = new Date();

    await this.logAudit(
      contractId,
      'PARTY_ADDED',
      addedBy,
      null,
      null,
      { partyId: party.id, role: party.role }
    );
  }

  /**
   * 添加条款到合约
   */
  async addTermToContract(
    contractId: string,
    term: Omit<ContractTerm, 'id' | 'createdAt' | 'updatedAt'>,
    addedBy: string
  ): Promise<void> {
    const contract = this.getContract(contractId);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new Error('只能为草稿状态的合约添加条款');
    }

    const newTerm: ContractTerm = {
      ...term,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    contract.terms.push(newTerm);
    contract.updatedAt = new Date();

    await this.logAudit(
      contractId,
      'TERM_ADDED',
      addedBy,
      null,
      null,
      { termId: newTerm.id, title: term.title }
    );
  }

  /**
   * 数字签名合约
   */
  async signContract(
    contractId: string,
    partyId: string,
    signature: string,
    privateKey?: string
  ): Promise<void> {
    const contract = this.getContract(contractId);
    const party = contract.parties.find(p => p.id === partyId);

    if (!party) {
      throw new Error('未找到指定的协作方');
    }

    // 验证签名
    const isValidSignature = await this.verifySignature(
      contractId,
      partyId,
      signature,
      privateKey
    );

    if (!isValidSignature) {
      throw new Error('无效的数字签名');
    }

    party.signature = signature;
    party.lastActive = new Date();
    contract.updatedAt = new Date();

    // 检查是否所有协作方都已签名
    const allSigned = contract.parties.every(p => p.signature);
    if (allSigned) {
      contract.status = ContractStatus.ACTIVE;
      await this.logAudit(contractId, 'CONTRACT_ACTIVATED', partyId);
    }

    await this.logAudit(contractId, 'CONTRACT_SIGNED', partyId);
  }

  /**
   * 更新条款状态
   */
  async updateTermStatus(
    contractId: string,
    termId: string,
    newStatus: ContractTerm['status'],
    updatedBy: string
  ): Promise<void> {
    const contract = this.getContract(contractId);
    const term = contract.terms.find(t => t.id === termId);

    if (!term) {
      throw new Error('未找到指定的条款');
    }

    const oldStatus = term.status;
    term.status = newStatus;
    term.updatedAt = new Date();
    contract.updatedAt = new Date();

    await this.logAudit(
      contractId,
      'TERM_STATUS_UPDATED',
      updatedBy,
      termId,
      oldStatus,
      { newStatus }
    );

    // 检查合约完成状态
    await this.checkContractCompletion(contractId);
  }

  /**
   * 暂停合约
   */
  async suspendContract(contractId: string, suspendedBy: string, reason?: string): Promise<void> {
    const contract = this.getContract(contractId);

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new Error('只能暂停活跃状态的合约');
    }

    contract.status = ContractStatus.SUSPENDED;
    contract.updatedAt = new Date();

    await this.logAudit(
      contractId,
      'CONTRACT_SUSPENDED',
      suspendedBy,
      null,
      null,
      { reason }
    );
  }

  /**
   * 终止合约
   */
  async terminateContract(
    contractId: string,
    terminatedBy: string,
    reason?: string
  ): Promise<void> {
    const contract = this.getContract(contractId);

    if (contract.status === ContractStatus.COMPLETED ||
        contract.status === ContractStatus.TERMINATED) {
      throw new Error('合约已完成或已终止');
    }

    contract.status = ContractStatus.TERMINATED;
    contract.updatedAt = new Date();

    await this.logAudit(
      contractId,
      'CONTRACT_TERMINATED',
      terminatedBy,
      null,
      null,
      { reason }
    );
  }

  /**
   * 获取合约
   */
  getContract(contractId: string): SmartContract {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error(`合约 ${contractId} 不存在`);
    }
    return contract;
  }

  /**
   * 获取所有合约
   */
  getAllContracts(): SmartContract[] {
    return Array.from(this.contracts.values());
  }

  /**
   * 获取协作方的合约
   */
  getContractsByParty(partyId: string): SmartContract[] {
    return Array.from(this.contracts.values()).filter(
      contract => contract.parties.some(party => party.id === partyId)
    );
  }

  /**
   * 更新协作方信誉
   */
  async updatePartyReputation(
    contractId: string,
    partyId: string,
    newReputation: number,
    reason: string,
    updatedBy: string
  ): Promise<void> {
    const contract = this.getContract(contractId);
    const party = contract.parties.find(p => p.id === partyId);

    if (!party) {
      throw new Error('未找到指定的协作方');
    }

    if (newReputation < 0 || newReputation > 100) {
      throw new Error('信誉评分必须在0-100之间');
    }

    const oldReputation = party.reputation;
    party.reputation = newReputation;
    party.lastActive = new Date();
    contract.updatedAt = new Date();

    await this.logAudit(
      contractId,
      'REPUTATION_UPDATED',
      updatedBy,
      partyId,
      oldReputation,
      { newReputation, reason }
    );
  }

  /**
   * 获取审计日志
   */
  getAuditLogs(contractId?: string, partyId?: string): AuditLog[] {
    let logs = this.auditLogs;

    if (contractId) {
      logs = logs.filter(log => log.contractId === contractId);
    }

    if (partyId) {
      logs = logs.filter(log => log.actor === partyId);
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * 私有方法：记录审计日志
   */
  private async logAudit(
    contractId: string,
    action: string,
    actor: string,
    target?: string | null,
    oldValue?: any,
    newValue?: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    const log: AuditLog = {
      id: uuidv4(),
      contractId,
      action,
      actor,
      target,
      oldValue,
      newValue,
      timestamp: new Date(),
      signature: await this.generateAuditSignature(contractId, action, actor)
    };

    this.auditLogs.push(log);
  }

  /**
   * 私有方法：检查合约完成状态
   */
  private async checkContractCompletion(contractId: string): Promise<void> {
    const contract = this.getContract(contractId);

    const allTermsCompleted = contract.terms.every(
      term => term.status === 'completed'
    );

    if (allTermsCompleted && contract.terms.length > 0) {
      contract.status = ContractStatus.COMPLETED;
      contract.updatedAt = new Date();

      await this.logAudit(contractId, 'CONTRACT_COMPLETED', 'system');
    }
  }

  /**
   * 私有方法：验证数字签名
   */
  private async verifySignature(
    contractId: string,
    partyId: string,
    signature: string,
    privateKey?: string
  ): Promise<boolean> {
    // 在实际应用中，这里应该使用加密库验证签名
    // 这里简化为基本的格式验证
    return signature.length > 10;
  }

  /**
   * 私有方法：生成审计签名
   */
  private async generateAuditSignature(
    contractId: string,
    action: string,
    actor: string
  ): Promise<string> {
    const data = `${contractId}-${action}-${actor}-${Date.now()}`;
    return CryptoJS.SHA256(data + this.encryptionKey).toString();
  }

  /**
   * 私有方法：生成加密密钥
   */
  private generateEncryptionKey(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  /**
   * 导出合约数据
   */
  exportContract(contractId: string): string {
    const contract = this.getContract(contractId);
    const logs = this.getAuditLogs(contractId);

    return JSON.stringify({
      contract,
      auditLogs: logs,
      exportedAt: new Date(),
      version: '1.0.0'
    }, null, 2);
  }

  /**
   * 导入合约数据
   */
  async importContract(data: string): Promise<SmartContract> {
    try {
      const imported = JSON.parse(data);
      const contract: SmartContract = imported.contract;

      // 验证合约数据
      if (!contract.id || !contract.name || !contract.parties) {
        throw new Error('无效的合约数据格式');
      }

      this.contracts.set(contract.id, contract);

      // 导入审计日志
      if (imported.auditLogs) {
        this.auditLogs.push(...imported.auditLogs);
      }

      return contract;
    } catch (error) {
      throw new Error(`导入合约失败: ${error}`);
    }
  }
}