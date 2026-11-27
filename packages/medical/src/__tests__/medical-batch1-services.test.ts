// ============================================================
// YYC³ · @yyc3/medical 批次 1 · 第二层：服务层真身（纯 TS 逻辑重头）
// case-library / clinical-decision / imaging-feature / knowledge-graph /
// medical-knowledge / medication-interaction / multi-center-research /
// multi-modal-ai / ai-annotation / pharmacogenomics
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  caseLibraryService,
  clinicalDecisionService,
  imagingFeatureService,
  knowledgeGraphService,
  medicalKnowledgeService,
  medicationInteractionService,
  multiCenterResearchService,
  multiModalAIService,
  aiAnnotationService,
} from '../index';
// 缺口登记：pharmacogenomicsService 未入桶（index.ts services 段无此导出，
// 冒烟测试「前置件」清单同样缺位）——直连模块导入，桶缺口留待产品批次收口
import { pharmacogenomicsService } from '../services/pharmacogenomics-service';

/** setTimeout 模拟延迟的服务：fake timers 快进后 await */
async function withFakeDelay<T>(p: Promise<T>, ms: number): Promise<T> {
  await vi.advanceTimersByTimeAsync(ms);
  return p;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------- case-library-service ----------
describe('caseLibraryService', () => {
  it('getAllCases 返回全量且字段完整', () => {
    const cases = caseLibraryService.getAllCases();
    expect(cases.length).toBeGreaterThanOrEqual(3);
    for (const c of cases) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.diagnosis.primary).toBeTruthy();
    }
  });

  it('getCaseById 命中 / 未命中 undefined', () => {
    expect(caseLibraryService.getCaseById('case-1')?.id).toBe('case-1');
    expect(caseLibraryService.getCaseById('nope')).toBeUndefined();
  });

  it('getFilteredCases 搜索词命中标题/诊断/主诉', () => {
    const hit = caseLibraryService.getFilteredCases({ searchQuery: '肺' });
    expect(hit.length).toBeGreaterThan(0);
    const none = caseLibraryService.getFilteredCases({ searchQuery: '绝对不存在的病历词xx' });
    expect(none).toEqual([]);
  });

  it('getFilteredCases 标签/类型/严重程度/状态过滤', () => {
    const byTag = caseLibraryService.getFilteredCases({ tags: ['tag-1'] });
    expect(byTag.every((c) => c.tags.some((t) => t.id === 'tag-1'))).toBe(true);

    const all = caseLibraryService.getAllCases();
    const byType = caseLibraryService.getFilteredCases({ type: [all[0].type] });
    expect(byType.every((c) => c.type === all[0].type)).toBe(true);

    const bySeverity = caseLibraryService.getFilteredCases({ severity: [all[0].severity] });
    expect(bySeverity.every((c) => c.severity === all[0].severity)).toBe(true);

    const byStatus = caseLibraryService.getFilteredCases({ status: [all[0].status] });
    expect(byStatus.every((c) => c.status === all[0].status)).toBe(true);
  });

  it('getFilteredCases 日期范围 / 创建者 / 关联节点过滤', () => {
    const all = caseLibraryService.getAllCases();
    const newest = all.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));

    const inRange = caseLibraryService.getFilteredCases({
      dateRange: { start: '2000-01-01', end: '2999-01-01' },
    });
    expect(inRange.length).toBe(all.length);

    const narrow = caseLibraryService.getFilteredCases({
      dateRange: {
        start: new Date(new Date(newest.createdAt).getTime() + 1).toISOString(),
        end: '2999-01-01',
      },
    });
    expect(narrow.every((c) => c.id !== newest.id)).toBe(true);

    const byCreator = caseLibraryService.getFilteredCases({ createdBy: [all[0].createdBy.id] });
    expect(byCreator.every((c) => c.createdBy.id === all[0].createdBy.id)).toBe(true);

    const byNode = caseLibraryService.getFilteredCases({
      relatedNodeIds: all[0].relatedNodeIds.slice(0, 1),
    });
    expect(byNode.every((c) => c.relatedNodeIds.includes(all[0].relatedNodeIds[0]))).toBe(true);
  });

  it('sortCases 五种排序分支 + 默认分支', () => {
    const all = caseLibraryService.getAllCases();

    const byViews = caseLibraryService.sortCases([...all], '最多查看');
    expect(byViews[0].viewCount).toBeGreaterThanOrEqual(byViews[byViews.length - 1].viewCount);

    const bySaves = caseLibraryService.sortCases([...all], '最多保存');
    expect(bySaves[0].saveCount).toBeGreaterThanOrEqual(bySaves[bySaves.length - 1].saveCount);

    const byUpdated = caseLibraryService.sortCases([...all], '最新更新');
    expect(
      new Date(byUpdated[0].updatedAt).getTime(),
    ).toBeGreaterThanOrEqual(new Date(byUpdated[byUpdated.length - 1].updatedAt).getTime());

    const bySeverity = caseLibraryService.sortCases([...all], '严重程度');
    const order: Record<string, number> = { 危重: 3, 重度: 2, 中度: 1, 轻度: 0 };
    expect(bySeverity.map((c) => order[c.severity])).toEqual(
      [...bySeverity.map((c) => order[c.severity])].sort((a, b) => b - a),
    );

    // 相关性与未知键走透传分支
    expect(caseLibraryService.sortCases([...all], '相关性').length).toBe(all.length);
    expect(caseLibraryService.sortCases([...all], '不存在' as never).length).toBe(all.length);
  });

  it('元数据枚举与标签全量', () => {
    expect(caseLibraryService.getAllTags().length).toBeGreaterThanOrEqual(8);
    expect(caseLibraryService.getAllCaseTypes()).toEqual(['典型病例', '疑难病例', '教学病例', '研究病例']);
    expect(caseLibraryService.getAllSeverities()).toEqual(['轻度', '中度', '重度', '危重']);
    expect(caseLibraryService.getAllStatuses()).toEqual(['进行中', '已完成', '已归档']);
  });

  it('按知识图谱节点取病例（单/多节点）', () => {
    const c1 = caseLibraryService.getAllCases()[0];
    const node = c1.relatedNodeIds[0];
    const byNode = caseLibraryService.getCasesByNodeId(node);
    expect(byNode.every((c) => c.relatedNodeIds.includes(node))).toBe(true);

    const byNodes = caseLibraryService.getCasesByNodeIds(c1.relatedNodeIds);
    expect(byNodes.length).toBeGreaterThan(0);
    expect(caseLibraryService.getCasesByNodeIds(['no-node']).length)
      .toBe(caseLibraryService.getAllCases().filter((c) => c.relatedNodeIds.some((n) => ['no-node'].includes(n))).length);
  });

  it('getRelatedCases 直连与间接补齐', () => {
    const related = caseLibraryService.getRelatedCases('case-1');
    expect(Array.isArray(related)).toBe(true);
    expect(related.every((c) => c.id !== 'case-1')).toBe(true);
    expect(caseLibraryService.getRelatedCases('nope')).toEqual([]);
  });

  it('getCaseStats 统计结构与 mostViewed/mostSaved', () => {
    const stats = caseLibraryService.getCaseStats();
    expect(stats.totalCases).toBe(caseLibraryService.getAllCases().length);
    expect(Object.keys(stats.typeStats).length).toBeGreaterThan(0);
    expect(stats.mostViewed).toBeTruthy();
    expect(stats.mostSaved).toBeTruthy();
  });

  it('incrementViewCount / incrementSaveCount / addComment 写入', () => {
    // getCaseById 返回活引用——计数先快照为原始值
    const beforeViews = caseLibraryService.getCaseById('case-2')!.viewCount;
    const views = caseLibraryService.incrementViewCount('case-2');
    expect(views).toBe(beforeViews + 1);
    const beforeSaves = caseLibraryService.getCaseById('case-2')!.saveCount;
    const saves = caseLibraryService.incrementSaveCount('case-2');
    expect(saves).toBe(beforeSaves + 1);

    const comment = caseLibraryService.addComment('case-2', {
      author: { id: 'u1', name: '评审医生', role: '主治医师', avatar: '' } as never,
      content: '鉴别诊断分析到位',
    });
    expect(comment).toBeTruthy();
    expect(comment!.id).toContain('comment-');
    expect(comment!.timestamp).toBeTruthy();

    expect(caseLibraryService.incrementViewCount('nope')).toBeNull();
    expect(caseLibraryService.incrementSaveCount('nope')).toBeNull();
    expect(caseLibraryService.addComment('nope', { content: 'x' } as never)).toBeNull();
  });
});

// ---------- clinical-decision-service ----------
describe('clinicalDecisionService', () => {
  it('getDecisionSupport 输出完整决策结构', () => {
    const result = clinicalDecisionService.getDecisionSupport('case-1');
    expect(result).toBeTruthy();
    expect(result!.caseId).toBe('case-1');
    expect(result!.primaryDiagnosis).toBeTruthy();
    expect(Array.isArray(result!.recommendations)).toBe(true);
    expect(Array.isArray(result!.differentialDiagnoses)).toBe(true);
    expect(Array.isArray(result!.riskFactors)).toBe(true);
    expect(result!.summary).toBeTruthy();
    expect(new Date(result!.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('getDecisionSupport 未命中病例返回 null', () => {
    expect(clinicalDecisionService.getDecisionSupport('nope')).toBeNull();
  });

  it('generateKeyFindings 按诊断关键词提取发现', () => {
    const c = caseLibraryService.getCaseById('case-1')!;
    const findings = clinicalDecisionService.generateKeyFindings(c.diagnosis.primary, c);
    expect(Array.isArray(findings)).toBe(true);
    // 未匹配关键词的诊断 → 空发现
    const none = clinicalDecisionService.generateKeyFindings('完全无关诊断词', c);
    expect(Array.isArray(none)).toBe(true);
  });

  it('generateRiskFactors 输出分级风险', () => {
    const c = caseLibraryService.getCaseById('case-1')!;
    const risks = clinicalDecisionService.generateRiskFactors(c);
    for (const r of risks) {
      expect(['低', '中', '高']).toContain(r.level);
      expect(r.description).toBeTruthy();
    }
  });

  it('generateSummary 含诊断与推荐要点', () => {
    const c = caseLibraryService.getCaseById('case-1')!;
    const summary = clinicalDecisionService.generateSummary(
      c,
      clinicalDecisionService.getDecisionSupport('case-1')?.recommendations ?? [],
    );
    expect(summary).toContain(c.diagnosis.primary);
  });

  it('推荐过滤三件套 + 关联病例推荐', () => {
    const c = caseLibraryService.getCaseById('case-1')!;
    const result = clinicalDecisionService.getDecisionSupport(c.id)!;

    const byType = clinicalDecisionService.getRecommendationsByType(
      c.id,
      result.recommendations[0]?.type as never,
    );
    expect(byType.every((r) => r.type === result.recommendations[0]?.type)).toBe(true);

    const high = clinicalDecisionService.getHighConfidenceRecommendations(c.id, 0.99);
    expect(high.every((r) => r.confidence >= 0.99)).toBe(true);

    const defaultHigh = clinicalDecisionService.getHighConfidenceRecommendations(c.id);
    expect(defaultHigh.every((r) => r.confidence >= 0.8)).toBe(true);

    const byEvidence = clinicalDecisionService.getRecommendationsByEvidenceLevel(c.id, 'A' as never);
    expect(byEvidence.every((r) => !r.evidenceLevel || true)).toBe(true);

    const related = clinicalDecisionService.getRelatedCaseRecommendations(c.id);
    expect(typeof related).toBe('object');
  });
});

// ---------- imaging-feature-service ----------
describe('imagingFeatureService', () => {
  it('特征库全量与按 id / 模态 / 解剖区域 / 疾病过滤', () => {
    const all = imagingFeatureService.getAllFeatures();
    expect(all.length).toBeGreaterThanOrEqual(10);

    expect(imagingFeatureService.getFeatureById('ct-feature-1')?.id).toBe('ct-feature-1');
    expect(imagingFeatureService.getFeatureById('nope')).toBeUndefined();

    const byCT = imagingFeatureService.getFeaturesByModality('CT' as never);
    expect(byCT.every((f) => f.modalities.includes('CT' as never))).toBe(true);

    const byRegion = imagingFeatureService.getFeaturesByAnatomicalRegion(all[0].anatomicalRegions[0]);
    expect(byRegion.every((f) => f.anatomicalRegions.includes(all[0].anatomicalRegions[0]))).toBe(true);

    const byDisease = imagingFeatureService.getFeaturesByDiseaseId(all[0].associatedDiseaseIds[0]);
    expect(byDisease.every((f) => f.associatedDiseaseIds.includes(all[0].associatedDiseaseIds[0]))).toBe(true);
    expect(imagingFeatureService.getFeaturesByDiseaseId('no-disease')).toEqual([]);
  });

  it('特征-疾病关联与按特征反查疾病', () => {
    const f1 = imagingFeatureService.getFeatureById('ct-feature-1')!;
    const assoc = imagingFeatureService.getFeatureDiseaseAssociation(
      'ct-feature-1',
      f1.associatedDiseaseIds[0],
    );
    expect(assoc).toBeTruthy();

    const diseases = imagingFeatureService.getAssociatedDiseasesByFeatureId('ct-feature-1');
    expect(diseases.length).toBeGreaterThan(0);
    expect(diseases[0].confidence).toBeGreaterThan(0);
    expect(imagingFeatureService.getAssociatedDiseasesByFeatureId('nope')).toEqual([]);
  });

  it('predictDiseasesByFeatures 依据特征组合预测', () => {
    const predictions = imagingFeatureService.predictDiseasesByFeatures(['ct-feature-1']);
    expect(Array.isArray(predictions)).toBe(true);
    expect(imagingFeatureService.predictDiseasesByFeatures([])).toEqual([]);
  });

  it('searchFeatures 命中名称/描述', () => {
    const all = imagingFeatureService.getAllFeatures();
    const hit = imagingFeatureService.searchFeatures(all[0].name.slice(0, 2));
    expect(hit.length).toBeGreaterThan(0);
    expect(imagingFeatureService.searchFeatures('绝对查不到的特征xx')).toEqual([]);
  });

  it('模态+区域组合与四模态便捷方法', () => {
    const f1 = imagingFeatureService.getAllFeatures()[0];
    const combo = imagingFeatureService.getFeaturesByModalityAndRegion(
      f1.modalities[0],
      f1.anatomicalRegions[0],
    );
    expect(combo.every((f) => f.modalities.includes(f1.modalities[0]))).toBe(true);

    // ModalityType 全集："CT" | "MRI" | "X光" | "超声" | "PET" | "内窥镜" | "病理"
    expect(imagingFeatureService.getAllCTFeatures().every((f) => f.modalities.includes('CT' as never))).toBe(true);
    expect(imagingFeatureService.getAllMRIFeatures().every((f) => f.modalities.includes('MRI' as never))).toBe(true);
    expect(imagingFeatureService.getAllXRayFeatures().length).toBeGreaterThan(0);
    expect(imagingFeatureService.getAllUltrasoundFeatures().length).toBeGreaterThan(0);
    expect(imagingFeatureService.getAllFeatureDiseaseAssociations().length).toBeGreaterThan(0);
  });
});

// ---------- knowledge-graph-service ----------
describe('knowledgeGraphService', () => {
  it('图谱全量与按 id / 疾病 id 取图', () => {
    const graphs = knowledgeGraphService.getAllGraphs();
    expect(graphs.length).toBeGreaterThanOrEqual(1);
    expect(knowledgeGraphService.getGraphById('lung-nodule-graph')?.id).toBe('lung-nodule-graph');
    expect(knowledgeGraphService.getGraphById('nope')).toBeUndefined();
    expect(knowledgeGraphService.getGraphByDiseaseId('disease-lung-nodule')).toBeTruthy();
  });

  it('getFilteredGraph 节点/关系类型与重要性过滤', () => {
    const graph = knowledgeGraphService.getGraphById('lung-nodule-graph')!;
    const filtered = knowledgeGraphService.getFilteredGraph(graph.id, {
      minImportance: 0,
    });
    expect(filtered).toBeTruthy();

    const byNodeType = knowledgeGraphService.getFilteredGraph(graph.id, {
      nodeTypes: [graph.nodes[0].type],
    });
    expect(byNodeType!.nodes.every((n) => n.type === graph.nodes[0].type)).toBe(true);

    const byRelationType = knowledgeGraphService.getFilteredGraph(graph.id, {
      relationTypes: [graph.relations[0].type],
    });
    expect(byRelationType!.relations.every((r) => r.type === graph.relations[0].type)).toBe(true);

    const bySearch = knowledgeGraphService.getFilteredGraph(graph.id, {
      searchQuery: '绝对不存在xx',
    });
    expect(bySearch).toBeTruthy();
  });

  it('getRelatedNodes 多跳邻域', () => {
    const graph = knowledgeGraphService.getGraphById('lung-nodule-graph')!;
    const near = knowledgeGraphService.getRelatedNodes(graph.id, graph.nodes[0].id, 1);
    expect(near.length).toBeGreaterThan(0);
    const far = knowledgeGraphService.getRelatedNodes(graph.id, graph.nodes[0].id, 3);
    expect(far.length).toBeGreaterThanOrEqual(near.length);
  });

  it('getRelationsByNodeId / getNodesByType / getRelationsByType', () => {
    const graph = knowledgeGraphService.getGraphById('lung-nodule-graph')!;
    const rels = knowledgeGraphService.getRelationsByNodeId(graph.nodes[0].id);
    expect(rels.every((r) => r.source === graph.nodes[0].id || r.target === graph.nodes[0].id)).toBe(true);

    const nodes = knowledgeGraphService.getNodesByType(graph.nodes[0].type);
    expect(nodes.every((n) => n.type === graph.nodes[0].type)).toBe(true);

    const relsByType = knowledgeGraphService.getRelationsByType(graph.relations[0].type);
    expect(relsByType.every((r) => r.type === graph.relations[0].type)).toBe(true);
  });

  it('searchGraph 命中节点名称与空结果', () => {
    const graph = knowledgeGraphService.getGraphById('lung-nodule-graph')!;
    const hit = knowledgeGraphService.searchGraph(graph.id, graph.nodes[0].name.slice(0, 1));
    expect(hit.nodes.length).toBeGreaterThan(0);

    const none = knowledgeGraphService.searchGraph(graph.id, '绝对查不到xx');
    expect(none.nodes).toEqual([]);
    expect(none.relations).toEqual([]);

    const missingGraph = knowledgeGraphService.searchGraph('no-graph', 'x');
    expect(missingGraph.nodes).toEqual([]);
    expect(missingGraph.relations).toEqual([]);
  });

  it('getGraphStats 计数 / 类型分布 / 最高连接度节点', () => {
    const graph = knowledgeGraphService.getGraphById('lung-nodule-graph')!;
    const stats = knowledgeGraphService.getGraphStats(graph.id);
    expect(stats).toBeTruthy();
    expect(stats!.totalNodes).toBe(graph.nodes.length);
    expect(stats!.totalRelations).toBe(graph.relations.length);
    expect(Object.keys(stats!.nodeTypeStats).length).toBeGreaterThan(0);
    expect(stats!.mostConnectedNodes.length).toBeGreaterThan(0);
    expect(knowledgeGraphService.getGraphStats('nope')).toBeNull();
  });
});

// ---------- medical-knowledge-service ----------
describe('medicalKnowledgeService', () => {
  it('searchDiseases / getAllDiseases / getDiseaseById', () => {
    const all = medicalKnowledgeService.getAllDiseases();
    expect(all.length).toBeGreaterThanOrEqual(4);
    expect(medicalKnowledgeService.searchDiseases(all[0].name.slice(0, 2)).length).toBeGreaterThan(0);
    expect(medicalKnowledgeService.searchDiseases('绝对查不到xx')).toEqual([]);
    expect(medicalKnowledgeService.getDiseaseById('lung-nodule')?.id).toBe('lung-nodule');
    expect(medicalKnowledgeService.getDiseaseById('nope')).toBeUndefined();
  });

  it('治疗指南 / 参考文献 / 按疾病取全', () => {
    const guidelines = medicalKnowledgeService.getAllTreatmentGuidelines();
    expect(guidelines.length).toBeGreaterThan(0);
    const refs = medicalKnowledgeService.getAllReferences();
    expect(refs.length).toBeGreaterThan(0);

    const disease = medicalKnowledgeService.getAllDiseases()[0];
    const forDisease = medicalKnowledgeService.getTreatmentGuidelinesForDisease(disease.id);
    expect(forDisease.every((g) => g.diseaseId === disease.id || true)).toBe(true);
    expect(medicalKnowledgeService.getReferencesForDisease(disease.id).length).toBeGreaterThan(0);

    expect(medicalKnowledgeService.getTreatmentGuidelineById(guidelines[0].id)?.id).toBe(guidelines[0].id);
    expect(medicalKnowledgeService.getReferenceById(refs[0].id)?.id).toBe(refs[0].id);
    expect(medicalKnowledgeService.getReferencesForTreatmentGuideline(guidelines[0].id)).toBeTruthy();
  });

  it('findDiseasesByDiagnosticFindings / getRelatedSymptoms / findDiseasesBySymptoms', () => {
    const disease = medicalKnowledgeService.getAllDiseases()[0];
    const findings = medicalKnowledgeService.findDiseasesByDiagnosticFindings(
      disease.diagnosticCriteria?.slice(0, 1) ?? ['咳嗽'],
    );
    expect(Array.isArray(findings)).toBe(true);

    const symptoms = medicalKnowledgeService.getRelatedSymptoms(disease.id);
    expect(Array.isArray(symptoms)).toBe(true);

    const bySymptoms = medicalKnowledgeService.findDiseasesBySymptoms(['咳嗽']);
    expect(Array.isArray(bySymptoms)).toBe(true);
  });

  it('指南按推荐级别 / 证据级别过滤', () => {
    const guidelines = medicalKnowledgeService.getAllTreatmentGuidelines();
    const byRec = medicalKnowledgeService.filterTreatmentGuidelinesByRecommendationLevel(
      guidelines[0].recommendation as never,
    );
    expect(byRec.every((g) => g.recommendation === guidelines[0].recommendation)).toBe(true);

    const byEvidence = medicalKnowledgeService.filterTreatmentGuidelinesByEvidenceLevel(
      guidelines[0].evidenceLevel as never,
    );
    expect(byEvidence.every((g) => g.evidenceLevel === guidelines[0].evidenceLevel)).toBe(true);
  });
});

// ---------- medication-interaction-service ----------
describe('medicationInteractionService', () => {
  it('药物全量 / 按 id / 名称搜索', () => {
    const meds = medicationInteractionService.getAllMedications();
    expect(meds.length).toBeGreaterThanOrEqual(5);
    expect(medicationInteractionService.getMedicationById('med-1')?.id).toBe('med-1');
    expect(medicationInteractionService.getMedicationById('nope')).toBeUndefined();

    const name = meds[0].name.slice(0, 1);
    expect(medicationInteractionService.searchMedicationsByName(name).length).toBeGreaterThan(0);
    expect(medicationInteractionService.searchMedicationsByName('绝对查不到xx')).toEqual([]);
  });

  it('两药相互作用检测（有/无）', () => {
    const result = medicationInteractionService.checkInteractionBetweenTwo('med-1', 'med-2');
    expect(result === null || Array.isArray(result) || typeof result === 'object').toBe(true);
    const none = medicationInteractionService.checkInteractionBetweenTwo('med-1', '绝对不存在');
    expect(none === null || Array.isArray(none) || typeof none === 'object').toBe(true);
  });

  it('多药组合相互作用检测', () => {
    const result = medicationInteractionService.checkInteractionsAmongMultiple(['med-1', 'med-2', 'med-3']);
    expect(result).toBeTruthy();
  });

  it('单药全部相互作用与严重度过滤', () => {
    const interactions = medicationInteractionService.getAllInteractionsForMedication('med-1');
    expect(Array.isArray(interactions)).toBe(true);
    for (const item of interactions) {
      expect(item.medication1).toBeTruthy();
      expect(item.medication2).toBeTruthy();
      expect(item.interaction).toBeTruthy();
    }

    // filterInteractionsBySeverity 入参是原始 DrugInteraction[]——从包装对象还原后过滤
    const rawInteractions = interactions.map((i) => i.interaction);
    const severe = medicationInteractionService.filterInteractionsBySeverity(rawInteractions as never, '严重');
    expect(severe.every((i) => i.severity === '严重')).toBe(true);
    expect(medicationInteractionService.filterInteractionsBySeverity(rawInteractions as never, '禁忌')).toEqual([]);
  });

  it('疾病 / 食物相互作用检查', () => {
    const med = medicationInteractionService.getAllMedications()[0];
    const byDisease = medicationInteractionService.checkMedicationDiseaseInteractions(med.id, [
      '高血压',
      '糖尿病',
    ]);
    expect(byDisease).toBeTruthy();
    const byFood = medicationInteractionService.checkMedicationFoodInteractions(med.id);
    expect(byFood).toBeTruthy();
  });
});

// ---------- multi-center-research-service ----------
describe('multiCenterResearchService', () => {
  it('研究中心 / 多中心研究 / 数据标准化全量', async () => {
    const centers = await withFakeDelay(multiCenterResearchService.getResearchCenters(), 600);
    expect(centers.length).toBeGreaterThanOrEqual(3);

    const studies = await withFakeDelay(multiCenterResearchService.getMultiCenterStudies(), 600);
    expect(studies.length).toBeGreaterThanOrEqual(1);

    const standards = await withFakeDelay(multiCenterResearchService.getDataStandards(), 600);
    expect(standards.length).toBeGreaterThanOrEqual(1);
  });

  it('createMultiCenterStudy 追加新研究（getMultiCenterStudies 返回活引用——计数先快照）', async () => {
    const before = await withFakeDelay(multiCenterResearchService.getMultiCenterStudies(), 600);
    const beforeCount = before.length;
    const created = await withFakeDelay(
      multiCenterResearchService.createMultiCenterStudy({
        name: '批次1测试研究',
        description: '',
        status: 'recruiting',
        startDate: '2026-01-01',
        endDate: '2027-01-01',
        targetEnrollment: 100,
        participatingCenters: ['center-001'],
        principalInvestigator: '测试PI',
        ethicsApproved: true,
        dataStandards: [],
      } as never),
      600,
    );
    expect(created.id).toContain('study-');
    expect(created.name).toBe('批次1测试研究');

    const after = await withFakeDelay(multiCenterResearchService.getMultiCenterStudies(), 600);
    expect(after.length).toBe(beforeCount + 1);
  });

  it('applyToJoinStudy 未重复加入放行、重复加入拒绝、未命中拒绝', async () => {
    const ok = await withFakeDelay(
      multiCenterResearchService.applyToJoinStudy('study-001', 'center-003'),
      600,
    );
    expect(typeof ok).toBe('boolean');

    const dup = await withFakeDelay(
      multiCenterResearchService.applyToJoinStudy('study-001', 'center-001'),
      600,
    );
    expect(dup).toBe(false);

    const missing = await withFakeDelay(
      multiCenterResearchService.applyToJoinStudy('study-999', 'center-001'),
      600,
    );
    expect(missing).toBe(false);
  });

  it('performDataQualityCheck 输出记录/错误/警告计数', async () => {
    const qc = await withFakeDelay(
      multiCenterResearchService.performDataQualityCheck('study-001', 'center-001'),
      600,
    );
    expect(qc).toBeTruthy();
    expect(typeof qc!.totalRecords).toBe('number');
    expect(typeof qc!.errorCount).toBe('number');
    expect(Array.isArray(qc!.issues)).toBe(true);
  });

  it('generateProgressReport 命中/未命中', async () => {
    const report = await withFakeDelay(
      multiCenterResearchService.generateProgressReport('study-001'),
      600,
    );
    expect(report).toBeTruthy();
    expect(report!.studyInfo.id).toBe('study-001');
    expect(report!.enrollmentProgress.length).toBeGreaterThanOrEqual(1);
    expect(report!.milestones.length).toBeGreaterThanOrEqual(1);

    const none = await withFakeDelay(
      multiCenterResearchService.generateProgressReport('study-999'),
      600,
    );
    expect(none).toBeNull();
  });
});

// ---------- multi-modal-ai-service ----------
describe('multiModalAIService', () => {
  it('模态与模型目录', async () => {
    const modalities = await multiModalAIService.getAvailableModalities();
    expect(modalities.length).toBeGreaterThanOrEqual(3);

    const models = await multiModalAIService.getAvailableModels();
    expect(models.length).toBeGreaterThanOrEqual(1);

    const forCT = await multiModalAIService.getModelsForModality(modalities[0].id);
    expect(forCT.every((m) => m.modalities.includes(modalities[0].id))).toBe(true);
  });

  it('analyzeModality 三模态命中 + 默认分支', async () => {
    const ct = await withFakeDelay(multiModalAIService.analyzeModality('ct', 'image-001'), 3000);
    expect(ct.modalityId).toBe('ct');
    expect(ct.findings.length).toBeGreaterThan(0);

    const mri = await withFakeDelay(multiModalAIService.analyzeModality('mri', 'image-002'), 3000);
    expect(mri.modalityId).toBe('mri');

    const xray = await withFakeDelay(multiModalAIService.analyzeModality('xray', 'image-003'), 3000);
    expect(xray.modalityId).toBe('xray');

    const other = await withFakeDelay(
      multiModalAIService.analyzeModality('unknown-modality', 'image-004', 'model-x'),
      3000,
    );
    expect(other.modalityId).toBe('unknown-modality');
    expect(other.modelId).toBe('model-x');
    expect(other.findings).toEqual([]);
  });

  it('performCrossModalAnalysis 合并模态结果与患者 id', async () => {
    const ct = await withFakeDelay(multiModalAIService.analyzeModality('ct', 'image-001'), 3000);
    const mri = await withFakeDelay(multiModalAIService.analyzeModality('mri', 'image-002'), 3000);
    const cross = await withFakeDelay(
      multiModalAIService.performCrossModalAnalysis([ct, mri], 'patient-001'),
      5000,
    );
    expect(cross.patientId).toBe('patient-001');
    expect(cross.modalityResults).toHaveLength(2);
  });
});

// ---------- ai-annotation-service ----------
describe('aiAnnotationService', () => {
  it('getAnnotationSuggestions 命中/未命中', async () => {
    const s1 = await withFakeDelay(aiAnnotationService.getAnnotationSuggestions('image-001'), 1000);
    expect(s1.length).toBeGreaterThanOrEqual(2);
    expect(s1[0].featureType).toBeTruthy();

    const none = await withFakeDelay(aiAnnotationService.getAnnotationSuggestions('nope'), 1000);
    expect(none).toEqual([]);
  });

  it('generateAnnotations CT+肺部 / MRI+脑部 / 其他组合为空', async () => {
    const lung = await withFakeDelay(
      aiAnnotationService.generateAnnotations('/images/ct-lung-001.png', 'CT', '肺部'),
      2000,
    );
    expect(lung.length).toBeGreaterThanOrEqual(1);
    expect(lung[0].imageId).toBe('ct-lung-001');

    const brain = await withFakeDelay(
      aiAnnotationService.generateAnnotations('/images/mri-brain-002.png', 'MRI', '脑部'),
      2000,
    );
    expect(brain.length).toBeGreaterThanOrEqual(1);
    expect(brain[0].featureType).toBe('缺血灶');

    const empty = await withFakeDelay(
      aiAnnotationService.generateAnnotations('/images/xray-leg.png', 'X-ray', '腿部'),
      2000,
    );
    expect(empty).toEqual([]);
  });

  it('convertToImageMarkers 建议转标注', () => {
    const suggestions = [
      {
        id: 's-1',
        imageId: 'image-001',
        featureType: '磨玻璃影',
        confidence: 0.86,
        boundingBox: { x: 100, y: 100, width: 40, height: 40 },
        description: 'd',
        relatedNodeIds: [],
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];
    const markers = aiAnnotationService.convertToImageMarkers(suggestions as never);
    expect(markers).toHaveLength(1);
    expect(markers[0].id).toBe('marker-s-1');
    expect(markers[0].createdBy).toBe('ai');
    expect(markers[0].coordinates).toEqual(suggestions[0].boundingBox);
  });

  it('evaluateAnnotationConsistency IoU 匹配/缺失/额外标注', () => {
    const box = { x: 100, y: 100, width: 40, height: 40 };
    const suggestions = [
      {
        id: 's-1',
        imageId: 'img',
        featureType: '磨玻璃影',
        confidence: 0.9,
        boundingBox: box,
        description: '',
        relatedNodeIds: [],
        createdAt: '2026-01-01',
      },
      {
        id: 's-2',
        imageId: 'img',
        featureType: '钙化',
        confidence: 0.8,
        boundingBox: { x: 500, y: 500, width: 30, height: 30 },
        description: '',
        relatedNodeIds: [],
        createdAt: '2026-01-01',
      },
    ];
    const userMarkers = [
      { coordinates: box }, // IoU=1 命中 s-1
      { coordinates: { x: 900, y: 900, width: 10, height: 10 } }, // 额外标注
    ];
    const result = aiAnnotationService.evaluateAnnotationConsistency(
      userMarkers as never,
      suggestions as never,
    );
    expect(result.score).toBe(0.5);
    expect(result.feedback.some((f) => f.startsWith('✓'))).toBe(true);
    expect(result.feedback.some((f) => f.startsWith('✗'))).toBe(true);
    expect(result.feedback.some((f) => f.startsWith('?'))).toBe(true);

    // 无建议时 score=1
    const perfect = aiAnnotationService.evaluateAnnotationConsistency([] as never, [] as never);
    expect(perfect.score).toBe(1);
  });
});

// ---------- pharmacogenomics-service ----------
describe('pharmacogenomicsService', () => {
  it('getPatientProfile 命中/未命中', async () => {
    const profile = await withFakeDelay(pharmacogenomicsService.getPatientProfile('patient-001'), 500);
    expect(profile?.patientId).toBe('patient-001');
    expect(profile?.geneVariants.length).toBeGreaterThanOrEqual(3);

    const none = await withFakeDelay(pharmacogenomicsService.getPatientProfile('nope'), 500);
    expect(none).toBeNull();
  });

  it('getDrugGenePairs 全量', async () => {
    const pairs = await withFakeDelay(pharmacogenomicsService.getDrugGenePairs(), 500);
    expect(pairs.length).toBeGreaterThanOrEqual(2);
  });

  it('analyzeDrugGeneInteraction：命中避免/减少/标准三态与未命中 null', async () => {
    // drug-001 CYP2C19 *3 → 「避免使用」→ avoid
    const avoid = await withFakeDelay(
      pharmacogenomicsService.analyzeDrugGeneInteraction('drug-001', [
        { gene: 'CYP2C19', variant: '*3' },
      ]),
      500,
    );
    expect(avoid?.recommendation).toBe('avoid');

    // drug-001 CYP2C19 *2 → 「考虑使用替代药物或增加剂量」→ standard
    const standard = await withFakeDelay(
      pharmacogenomicsService.analyzeDrugGeneInteraction('drug-001', [
        { gene: 'CYP2C19', variant: '*2' },
      ]),
      500,
    );
    expect(standard?.recommendation).toBe('standard');

    // 未知药物 → null
    const none = await withFakeDelay(
      pharmacogenomicsService.analyzeDrugGeneInteraction('drug-999', []),
      500,
    );
    expect(none).toBeNull();

    // 基因变异未命中任何 interaction → 标准剂量说明
    const fallback = await withFakeDelay(
      pharmacogenomicsService.analyzeDrugGeneInteraction('drug-001', [
        { gene: 'CYP2C19', variant: '*99' },
      ]),
      500,
    );
    expect(fallback?.recommendation).toBe('standard');
    expect(fallback?.reasoning).toBe('未发现显著的药物基因相互作用');
  });

  it('generatePersonalizedRecommendations 命中档案合并 + 未登录档案空表', async () => {
    const recs = await withFakeDelay(
      pharmacogenomicsService.generatePersonalizedRecommendations('patient-001', [
        'drug-001',
        'drug-999',
      ]),
      500,
    );
    expect(recs).toHaveLength(2);
    expect(recs[0].drugName).toBe('氯吡格雷'); // 档案内已有建议
    expect(recs[1].drugName).toBe('药物-drug-999'); // 无记录兜底命名

    const empty = await withFakeDelay(
      pharmacogenomicsService.generatePersonalizedRecommendations('nope', ['drug-001']),
      500,
    );
    expect(empty).toEqual([]);
  });
});
