// ============================================================
// YYC³ · @yyc3/lib services/speech-service 覆盖率补测（batch1 弱区：28.14%）
// 覆盖对象：SpeechRecognitionService / SpeechSynthesisService / MultiLanguageSpeechManager
// 方法：jsdom 无 SpeechRecognition/speechSynthesis/SpeechSynthesisUtterance——
//       按最小环境垫片注入 Fake 类（不打桩服务逻辑本身），驱动 onstart/onresult/
//       onerror/onend 事件与 utterance 生命周期回调走真身分支。
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SpeechRecognitionService,
  SpeechSynthesisService,
  MultiLanguageSpeechManager,
} from '../index';

// ------------------------------------------------------------
// 环境垫片（最小 Fake，仅承载事件回调装载）
// ------------------------------------------------------------
class FakeSpeechRecognition {
  lang = '';
  continuous = false;
  interimResults = false;
  maxAlternatives = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
  abort = vi.fn();
}

class FakeUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

interface FakeVoice {
  name: string;
  lang: string;
  default?: boolean;
}

const makeVoice = (name: string, lang: string, isDefault = false): SpeechSynthesisVoice =>
  ({ name, lang, default: isDefault, voiceURI: name, localService: true }) as SpeechSynthesisVoice;

// 识别结果事件（results 为数组的数组：results[最后一条][备选列表]）
const makeResultEvent = (
  transcript: string,
  confidence = 0.9,
  isFinal = true,
  alternatives: string[] = [transcript],
) => {
  const lastResult = {
    isFinal,
    length: alternatives.length,
    0: { transcript, confidence },
    ...Object.fromEntries(alternatives.slice(1).map((t, i) => [i + 1, { transcript: t, confidence }])),
    [Symbol.iterator]: function* () {
      for (const alt of alternatives) yield { transcript: alt, confidence };
    },
  };
  return { results: { length: 1, 0: lastResult, [Symbol.iterator]: function* () { yield lastResult; } } };
};

const stubRecognitionEnv = () => {
  (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = FakeSpeechRecognition;
};

const stubSynthesisEnv = (voices: SpeechSynthesisVoice[] = [], state: Partial<Record<'speaking' | 'paused' | 'pending', boolean>> = {}) => {
  const synth = {
    voices,
    speaking: state.speaking ?? false,
    paused: state.paused ?? false,
    pending: state.pending ?? false,
    onvoiceschanged: null as (() => void) | null,
    getVoices: vi.fn(() => synth.voices),
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  };
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = synth;
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = FakeUtterance;
  return synth;
};

const getRecognitionOf = (svc: SpeechRecognitionService): FakeSpeechRecognition =>
  (svc as unknown as { recognition: FakeSpeechRecognition }).recognition;

// ============================================================
// SpeechRecognitionService
// ============================================================
describe('SpeechRecognitionService · 环境不支持（jsdom 原生）', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  });

  it('无 SpeechRecognition 时降级：isSupported false + recognition null + 调用不炸', () => {
    const svc = new SpeechRecognitionService();

    expect(svc.isSupported()).toBe(false);
    expect(console.warn).toHaveBeenCalledWith('浏览器不支持语音识别');
    expect(svc.getStatus()).toEqual({ isSupported: false, isListening: false, language: 'zh-CN', commandCount: 2 });
    // recognition 为 null 的降级路径
    expect(() => svc.startListening({ language: 'en-US' })).not.toThrow();
    expect(() => svc.stopListening()).not.toThrow();
  });
});

describe('SpeechRecognitionService · 环境支持（Fake 注入）', () => {
  beforeEach(() => {
    stubRecognitionEnv();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  });

  it('构造即装配识别器：continuous/interim/lang/maxAlternatives 默认值', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);

    expect(rec).toBeInstanceOf(FakeSpeechRecognition);
    expect(rec.continuous).toBe(true);
    expect(rec.interimResults).toBe(true);
    expect(rec.lang).toBe('zh-CN');
    expect(rec.maxAlternatives).toBe(3);
    expect(svc.isSupported()).toBe(true);
  });

  it('onstart/onend 驱动 isListening 状态', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);

    rec.onstart!();
    expect(svc.getStatus().isListening).toBe(true);
    rec.onend!();
    expect(svc.getStatus().isListening).toBe(false);
  });

  it('startListening 应用 options 并启动；监听中重复调用早退；stopListening 停止', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);

    svc.startListening({ language: 'en-US', continuous: false, interimResults: false, maxAlternatives: 2 });
    expect(rec.lang).toBe('en-US');
    expect(rec.continuous).toBe(false);
    expect(rec.interimResults).toBe(false);
    expect(rec.maxAlternatives).toBe(2);
    expect(rec.start).toHaveBeenCalledTimes(1);

    // isListening=true 后早退分支：onstart 手动触发模拟浏览器行为
    rec.onstart!();
    svc.startListening();
    expect(rec.start).toHaveBeenCalledTimes(1);

    svc.stopListening();
    expect(rec.stop).toHaveBeenCalledTimes(1);
    // 未监听时 stopListening 早退（rec.onend 未触发，isListening 仍 true→已停一次；再触发 onend 后不再调用）
    rec.onend!();
    svc.stopListening();
    expect(rec.stop).toHaveBeenCalledTimes(1);
  });

  it('startListening 传 options 时 start() 抛错被捕获不炸', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);
    rec.start = vi.fn(() => {
      throw new Error('already started');
    });

    expect(() => svc.startListening({ language: 'en-US' })).not.toThrow();
    expect(console.error).toHaveBeenCalledWith('启动语音识别失败:', expect.any(Error));
  });

  it('onresult 非最终结果：回调透传 transcript/confidence/isFinal/alternatives，不触发命令', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);
    const onResult = vi.fn();
    svc.onResult(onResult);
    rec.onstart!(); // isListening = true，命令里 stop_listening 才会真停

    rec.onresult!(makeResultEvent('打开面板', 0.8, false, ['打开面板', '打开面板吧']));

    expect(onResult).toHaveBeenCalledWith({
      transcript: '打开面板',
      confidence: 0.8,
      isFinal: false,
      alternatives: ['打开面板', '打开面板吧'],
    });
  });

  it('onresult 最终结果命中默认命令「停止」→ 触发 stopListening', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);
    const onResult = vi.fn();
    svc.onResult(onResult);
    rec.onstart!();

    rec.onresult!(makeResultEvent(' 停止 听写 ')); // trim + lower 归一化后命中 /停止/

    expect(onResult).toHaveBeenCalledTimes(1);
    expect(rec.stop).toHaveBeenCalledTimes(1);
  });

  it('onresult 最终结果命中默认命令「帮助」→ 走 showAvailableCommands（按类别打印）', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);

    rec.onresult!(makeResultEvent('帮助'));

    expect(console.log).toHaveBeenCalledWith('可用语音命令:');
    expect(console.log).toHaveBeenCalledWith('系统控制:');
    expect(console.log).toHaveBeenCalledWith('  - 停止语音识别');
  });

  it('registerCommand 自定义命令参与匹配并接收 match.slice(1) 参数', () => {
    const svc = new SpeechRecognitionService();
    const action = vi.fn();
    svc.registerCommand({
      command: 'open_page',
      patterns: [/打开\s*(\S+)/],
      action,
      description: '打开页面',
      category: '导航',
    });

    getRecognitionOf(svc).onresult!(makeResultEvent('打开 仪表盘'));

    expect(action).toHaveBeenCalledWith(['仪表盘']);
  });

  it('registerCommands 批量注册计入 commandCount；无命中文本不执行任何命令', () => {
    const svc = new SpeechRecognitionService();
    const action = vi.fn();
    svc.registerCommands([
      { command: 'a', patterns: [/苹果/], action, description: 'a', category: 'c1' },
      { command: 'b', patterns: [/香蕉/], action, description: 'b', category: 'c1' },
    ]);

    expect(svc.getStatus().commandCount).toBe(4); // 默认 2 + 新增 2

    getRecognitionOf(svc).onresult!(makeResultEvent('今天天气不错'));
    expect(action).not.toHaveBeenCalled();
  });

  it('onerror 事件：已知错误码翻译 + 未知错误码走「未知错误」分支', () => {
    const svc = new SpeechRecognitionService();
    const rec = getRecognitionOf(svc);
    const onError = vi.fn();
    svc.onError(onError);

    rec.onerror!({ error: 'not-allowed' });
    expect(onError).toHaveBeenLastCalledWith('麦克风权限被拒绝');

    rec.onerror!({ error: 'audio-capture' });
    expect(onError).toHaveBeenLastCalledWith('无法捕获音频');

    rec.onerror!({ error: 'language-not-supported' });
    expect(onError).toHaveBeenLastCalledWith('不支持的语言');

    rec.onerror!({ error: 'mystery' });
    expect(onError).toHaveBeenLastCalledWith('未知错误: mystery');
  });

  it('onresult 空结果列表不回调（lastResult 缺省分支）', () => {
    const svc = new SpeechRecognitionService();
    const onResult = vi.fn();
    svc.onResult(onResult);

    getRecognitionOf(svc).onresult!({ results: [] });

    expect(onResult).not.toHaveBeenCalled();
  });
});

// ============================================================
// SpeechSynthesisService
// ============================================================
describe('SpeechSynthesisService · 环境不支持（降级桩）', () => {
  beforeEach(() => {
    delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  });
  afterEach(() => {
    delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  });

  it('降级桩下 speak 拒绝、其余调用不炸', async () => {
    const svc = new SpeechSynthesisService();

    expect(svc.isSupported()).toBe(false);
    await expect(svc.speak('你好')).rejects.toThrow('浏览器不支持语音合成');
    expect(() => svc.stop()).not.toThrow();
    expect(() => svc.pause()).not.toThrow();
    expect(() => svc.resume()).not.toThrow();
    // batch2 缺陷修复后：降级桩补齐 speaking/paused/pending 三态属性，
    // getStatus 返回合法默认值 false（不再为 undefined）
    expect(svc.getStatus()).toEqual({
      isSupported: false,
      speaking: false,
      paused: false,
      pending: false,
      voiceCount: 0,
      currentVoice: '未选择',
    });
  });
});

describe('SpeechSynthesisService · 环境支持（Fake 注入）', () => {
  afterEach(() => {
    delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  });

  it('loadVoices 优先选中文语音', () => {
    const zh = makeVoice('Ting', 'zh-CN');
    const en = makeVoice('Ava', 'en-US', true);
    stubSynthesisEnv([en, zh]);

    const svc = new SpeechSynthesisService();
    expect(svc.getVoices()).toEqual([en, zh]);
    expect((svc as unknown as { currentVoice: SpeechSynthesisVoice }).currentVoice).toBe(zh);
    expect(svc.getStatus().currentVoice).toBe('Ting');
  });

  it('无中文语音时回退 default 语音', () => {
    const enDefault = makeVoice('Ava', 'en-US', true);
    const enOther = makeVoice('Sam', 'en-US');
    stubSynthesisEnv([enOther, enDefault]);

    const svc = new SpeechSynthesisService();
    expect((svc as unknown as { currentVoice: SpeechSynthesisVoice }).currentVoice).toBe(enDefault);
  });

  it('无中文且无 default 时取首个语音', () => {
    const v1 = makeVoice('Sam', 'en-US');
    const v2 = makeVoice('Jo', 'ja-JP');
    stubSynthesisEnv([v1, v2]);

    const svc = new SpeechSynthesisService();
    expect((svc as unknown as { currentVoice: SpeechSynthesisVoice }).currentVoice).toBe(v1);
  });

  it(' voices 异步加载：初始为空挂 onvoiceschanged，触发后补选语音', () => {
    const synth = stubSynthesisEnv([]);
    const svc = new SpeechSynthesisService();

    expect(svc.getVoices()).toEqual([]);
    expect(synth.onvoiceschanged).toBeTypeOf('function');

    const zh = makeVoice('Ting', 'zh-CN');
    synth.voices.push(zh);
    synth.onvoiceschanged!();

    expect(svc.getVoices()).toEqual([zh]);
    expect((svc as unknown as { currentVoice: SpeechSynthesisVoice }).currentVoice).toBe(zh);
  });

  it('speak 应用默认设置与当前语音，onend 解析 Promise；播报前先 stop（speaking=true → cancel）', async () => {
    const zh = makeVoice('Ting', 'zh-CN');
    const synth = stubSynthesisEnv([zh], { speaking: true });
    const svc = new SpeechSynthesisService();
    expect(synth.cancel).not.toHaveBeenCalled(); // 构造期不 cancel

    const promise = svc.speak('你好，世界');
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;

    expect(utterance.text).toBe('你好，世界');
    expect(utterance.rate).toBe(1);
    expect(utterance.pitch).toBe(1);
    expect(utterance.volume).toBe(1);
    expect(utterance.lang).toBe('zh-CN');
    expect(utterance.voice).toBe(zh);
    expect(synth.cancel).toHaveBeenCalledTimes(1); // stop() 分支

    utterance.onend!();
    await expect(promise).resolves.toBeUndefined();
  });

  it('speak 显式 options 覆盖默认；显式 voice 优先于 currentVoice', async () => {
    const zh = makeVoice('Ting', 'zh-CN');
    const synth = stubSynthesisEnv([zh]);
    const svc = new SpeechSynthesisService();
    const customVoice = makeVoice('Custom', 'en-US');

    const promise = svc.speak('hello', { rate: 1.5, pitch: 0.8, volume: 0.5, language: 'en-US', voice: customVoice });
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;

    expect(utterance.rate).toBe(1.5);
    expect(utterance.pitch).toBe(0.8);
    expect(utterance.volume).toBe(0.5);
    expect(utterance.lang).toBe('en-US');
    expect(utterance.voice).toBe(customVoice);
    expect(synth.cancel).not.toHaveBeenCalled(); // speaking=false → stop 不 cancel

    utterance.onend!();
    await promise;
  });

  it('speak onerror 拒绝 Promise', async () => {
    stubSynthesisEnv([makeVoice('Ting', 'zh-CN')]);
    const svc = new SpeechSynthesisService();

    const promise = svc.speak('你好');
    const utterance = (window.speechSynthesis.speak as ReturnType<typeof vi.fn>).mock.calls[0][0] as FakeUtterance;
    utterance.onerror!({ error: 'interrupted' });

    await expect(promise).rejects.toThrow('语音合成错误: interrupted');
  });

  it('stop/pause/resume 仅在对应状态下调用 synth 方法', () => {
    stubSynthesisEnv([makeVoice('Ting', 'zh-CN')], { speaking: true, paused: false });
    const svc = new SpeechSynthesisService();
    const synth = window.speechSynthesis;

    svc.pause(); // speaking && !paused → pause
    expect(synth.pause).toHaveBeenCalledTimes(1);
    svc.resume(); // !paused → 不调用
    expect(synth.resume).not.toHaveBeenCalled();

    // speaking=false 分支
    synth.speaking = false;
    svc.stop();
    expect(synth.cancel).not.toHaveBeenCalled();
    svc.pause(); // !speaking → 不调用
    expect(synth.pause).toHaveBeenCalledTimes(1);

    // paused=true 分支
    synth.paused = true;
    svc.resume();
    expect(synth.resume).toHaveBeenCalledTimes(1);
  });

  it('getVoicesByLanguage 按语言前缀过滤；setVoice 换当前语音；setDefaultSettings 合并默认配置', () => {
    const zh1 = makeVoice('Ting', 'zh-CN');
    const zh2 = makeVoice('Mandarin', 'zh-TW');
    const en = makeVoice('Ava', 'en-US', true);
    stubSynthesisEnv([zh1, zh2, en]);

    const svc = new SpeechSynthesisService();
    expect(svc.getVoicesByLanguage('zh')).toEqual([zh1, zh2]);
    expect(svc.getVoicesByLanguage('en')).toEqual([en]);
    expect(svc.getVoicesByLanguage('fr')).toEqual([]);

    svc.setVoice(en);
    expect(svc.getStatus().currentVoice).toBe('Ava');

    svc.setDefaultSettings({ rate: 0.9, language: 'en-US' });
    expect((svc as unknown as { defaultSettings: Record<string, unknown> }).defaultSettings).toMatchObject({
      rate: 0.9,
      language: 'en-US',
      pitch: 1,
      volume: 1,
    });
  });

  it('getStatus 反映 speaking/paused/pending 与 voiceCount', () => {
    stubSynthesisEnv([makeVoice('Ting', 'zh-CN')], { speaking: true, paused: true, pending: true });
    const svc = new SpeechSynthesisService();

    expect(svc.getStatus()).toEqual({
      isSupported: true,
      speaking: true,
      paused: true,
      pending: true,
      voiceCount: 1,
      currentVoice: 'Ting',
    });
  });
});

// ============================================================
// MultiLanguageSpeechManager
// ============================================================
describe('MultiLanguageSpeechManager', () => {
  beforeEach(() => {
    stubRecognitionEnv();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  });

  const stubVoices = () => {
    const zhCN = makeVoice('Tingting', 'zh-CN');
    const zhTW = makeVoice('Mei', 'zh-TW');
    const enUS = makeVoice('Ava', 'en-US');
    const enGB = makeVoice('Serena', 'en-GB');
    const synth = stubSynthesisEnv([zhCN, zhTW, enUS, enGB]);
    return { synth, zhCN, zhTW, enUS, enGB };
  };

  it('按可用语音初始化语音配置文件；支持语言清单带 hasVoice 标记', () => {
    stubVoices();
    const manager = new MultiLanguageSpeechManager();

    expect(manager.getCurrentLanguage()).toBe('zh-CN');
    const languages = manager.getSupportedLanguages();
    expect(languages).toHaveLength(10); // 语言配置全集
    const byCode = Object.fromEntries(languages.map((l) => [l.code, l.hasVoice]));
    expect(byCode['zh-CN']).toBe(true);
    expect(byCode['zh-TW']).toBe(true);
    expect(byCode['en-US']).toBe(true);
    expect(byCode['en-GB']).toBe(true);
    expect(byCode['ja-JP']).toBe(false); // 无日语语音
    expect(manager.getSupportedLanguages()[0]).toEqual({ code: 'zh-CN', name: '中文(简体)', flag: '🇨🇳', hasVoice: true });

    expect(manager.getVoiceProfile('zh-CN')!.voice.name).toBe('Tingting');
    expect(manager.getVoiceProfile('fr-FR')).toBeUndefined();
  });

  it('switchLanguage：支持语言切换并回填语音；不支持语言不动；支持但无语音只切语言', () => {
    stubVoices();
    const manager = new MultiLanguageSpeechManager();
    const synth = manager.getSynthesisService();
    const setVoiceSpy = vi.spyOn(synth, 'setVoice');

    manager.switchLanguage('en-US');
    expect(manager.getCurrentLanguage()).toBe('en-US');
    expect(setVoiceSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'Ava' }));

    manager.switchLanguage('xx-XX'); // 不在语言配置中 → 忽略
    expect(manager.getCurrentLanguage()).toBe('en-US');

    manager.switchLanguage('ja-JP'); // 支持但无语音 profile → 只切语言
    expect(manager.getCurrentLanguage()).toBe('ja-JP');
  });

  it('speakInLanguage：有 profile 用 profile.settings；无 profile 回退 { language }；默认当前语言', async () => {
    stubVoices();
    const manager = new MultiLanguageSpeechManager();
    const synth = manager.getSynthesisService();
    const speakSpy = vi.spyOn(synth, 'speak').mockResolvedValue(undefined);

    await manager.speakInLanguage('你好', 'zh-CN');
    expect(speakSpy).toHaveBeenLastCalledWith('你好', manager.getVoiceProfile('zh-CN')!.settings);

    await manager.speakInLanguage('こんにちは', 'ja-JP'); // 无 profile
    expect(speakSpy).toHaveBeenLastCalledWith('こんにちは', { language: 'ja-JP' });

    manager.switchLanguage('ja-JP'); // 支持但无语音 → currentLanguage 变更
    await manager.speakInLanguage('默认语言播报'); // 未传语言 → currentLanguage
    expect(speakSpy).toHaveBeenLastCalledWith('默认语言播报', { language: 'ja-JP' });
  });

  it('updateVoiceProfile 合并设置；无 profile 时为 no-op', () => {
    stubVoices();
    const manager = new MultiLanguageSpeechManager();

    manager.updateVoiceProfile('zh-CN', { rate: 1.2, volume: 0.6 });
    const profile = manager.getVoiceProfile('zh-CN')!;
    expect(profile.settings).toMatchObject({ rate: 1.2, volume: 0.6, language: 'zh-CN' });
    expect(profile.name).toBe('中文(简体)');

    manager.updateVoiceProfile('fr-FR', { rate: 2 }); // 不存在 → 不抛不建
    expect(manager.getVoiceProfile('fr-FR')).toBeUndefined();
  });

  it('getRecognitionService / getSynthesisService 返回内部服务实例', () => {
    stubVoices();
    const manager = new MultiLanguageSpeechManager();

    expect(manager.getRecognitionService()).toBeInstanceOf(SpeechRecognitionService);
    expect(manager.getSynthesisService()).toBeInstanceOf(SpeechSynthesisService);
  });
});
