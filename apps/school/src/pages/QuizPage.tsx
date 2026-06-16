import { CaretLeftOutlined, CaretRightOutlined, CloudUploadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tabs, Tag, Typography, message } from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { KnowledgeTag } from '../components/KnowledgeTag';
import { SchoolLayout } from '../components/SchoolLayout';
import { getChapter } from '../data/chapters';
import { chapterSiteUrl } from '../data/siteLinks';
import { getAdjacentChapter, getQuiz } from '../data/quizzes';
import { getRecord, addSubmission, saveRecord, type SubmitVersion } from '../lib/quizProgress';

const { Title, Paragraph, Text } = Typography;

type Props = {
  chapterId: string;
  navigate: (path: string) => void;
};

const diffColor = { Easy: 'green', Medium: 'orange', Hard: 'red' } as const;

export const QuizPage: FC<Props> = ({ chapterId, navigate }) => {
  const chapter = getChapter(chapterId);
  const quiz = getQuiz(chapterId);
  const adj = getAdjacentChapter(chapterId);

  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ pass: boolean; message: string } | null>(null);
  const [submissions, setSubmissions] = useState<SubmitVersion[]>([]);
  const [viewSubmit, setViewSubmit] = useState<SubmitVersion | null>(null);
  const [bottomTab, setBottomTab] = useState('testcase');
  const statusRef = useRef<'doing' | 'done' | 'todo'>('todo');
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    let cancelled = false;
    (async () => {
      if (!quiz) return;
      const record = await getRecord(chapterId);
      if (cancelled) return;
      statusRef.current = record?.status ?? 'todo';
      setCode(record?.content || quiz.starterCode);
      setSubmissions(record?.submissions ?? []);
      setResult(null);
      setBottomTab('testcase');
      loadedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterId, quiz]);

  useEffect(() => {
    if (!quiz || !loadedRef.current || statusRef.current === 'done') return;
    if (code === quiz.starterCode && statusRef.current === 'todo') return;
    const t = setTimeout(() => {
      saveRecord(chapterId, code, 'doing');
      statusRef.current = 'doing';
    }, 400);
    return () => clearTimeout(t);
  }, [code, chapterId, quiz]);

  const runCheck = useCallback(
    async (submit: boolean) => {
      if (!quiz) return;
      const r = quiz.validate(code);
      setResult(r);
      setBottomTab('result');
      if (submit) {
        const list = await addSubmission(chapterId, code, r.pass, r.message);
        setSubmissions(list);
        statusRef.current = r.pass ? 'done' : statusRef.current === 'done' ? 'done' : 'doing';
      } else if (r.pass) {
        await saveRecord(chapterId, code, 'done');
        statusRef.current = 'done';
        message.success('运行通过');
      } else {
        message.error(r.message);
        return;
      }
      if (submit) {
        message[r.pass ? 'success' : 'error'](r.pass ? '提交成功！' : r.message);
      }
    },
    [code, quiz, chapterId],
  );

  if (!chapter || !quiz) {
    return (
      <SchoolLayout onBack={() => navigate('/java-route')} dark>
        <div className="flex flex-1 items-center justify-center text-[#eff1f6]">章节不存在</div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout
      dark
      onBack={() => navigate('/java-route')}
      backLabel="题目列表"
      extra={
        <Space>
          <Button
            type="text"
            icon={<CaretLeftOutlined />}
            disabled={!adj.prev}
            onClick={() => adj.prev && navigate(`/java-route/${adj.prev}`)}
            className="!text-[#eff1f6]"
          />
          <Text className="!text-[#8c8c8c]">
            {chapter.num}. {quiz.title}
          </Text>
          <Button
            type="text"
            icon={<CaretRightOutlined />}
            disabled={!adj.next}
            onClick={() => adj.next && navigate(`/java-route/${adj.next}`)}
            className="!text-[#eff1f6]"
          />
        </Space>
      }
    >
      <div className="flex h-[calc(100vh-64px)] flex-col">
        {/* LeetCode-style toolbar */}
        <div className="flex items-center justify-between border-b border-[#3a3a3a] bg-[#282828] px-4 py-2">
          <Space>
            <Tag color={diffColor[quiz.difficulty]}>{quiz.difficulty}</Tag>
            {quiz.tags.map((t) => (
              <KnowledgeTag
                key={t}
                tag={t}
                chapterId={chapterId}
                className="!border-[#3a3a3a] !bg-[#1a1a1a] !text-[#b3b3b3]"
              />
            ))}
          </Space>
          <Space>
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => runCheck(false)}
              className="!border-[#3a3a3a] !bg-[#1a1a1a] !text-[#eff1f6]"
            >
              运行
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => runCheck(true)}
              className="!bg-[#2cbb5d] !border-[#2cbb5d]"
            >
              提交
            </Button>
          </Space>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Left: description */}
          <div className="w-[45%] overflow-y-auto border-r border-[#3a3a3a] bg-[#1a1a1a] p-5">
            <Title level={4} className="!text-[#eff1f6] !mb-1">
              {chapter.num}. {quiz.title}
            </Title>
            <a
              href={chapterSiteUrl(chapterId)}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#8c8c8c] hover:text-[#ffa116]"
            >
              {chapter.title}
            </a>

            <div className="mt-5 space-y-4 text-[#eff1f6] text-sm leading-relaxed">
              {quiz.story.split('\n\n').map((p, i) => (
                <Paragraph key={i} className="!text-[#eff1f6] !mb-0 whitespace-pre-wrap">
                  {p.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**'))
                      return (
                        <strong key={j} className="text-[#ffa116]">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    if (part.startsWith('`') && part.endsWith('`'))
                      return (
                        <code key={j} className="rounded bg-[#282828] px-1 text-[#ffa116]">
                          {part.slice(1, -1)}
                        </code>
                      );
                    return part;
                  })}
                </Paragraph>
              ))}
            </div>

            {quiz.examples.map((ex, i) => (
              <div key={i} className="mt-5 rounded-lg bg-[#282828] p-4">
                <Text strong className="!text-[#eff1f6]">
                  示例 {i + 1}
                </Text>
                <pre className="mt-2 text-xs text-[#b3b3b3]">
                  <div>
                    <span className="text-[#8c8c8c]">输入：</span>
                    {ex.input}
                  </div>
                  <div>
                    <span className="text-[#8c8c8c]">输出：</span>
                    {ex.output}
                  </div>
                  {ex.explanation && <div className="mt-1 text-[#8c8c8c]">解释：{ex.explanation}</div>}
                </pre>
              </div>
            ))}

            <div className="mt-5">
              <Text strong className="!text-[#eff1f6]">
                约束
              </Text>
              <ul className="mt-2 list-disc pl-5 text-[#b3b3b3] text-sm">
                {quiz.constraints.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: editor + bottom panel */}
          <div className="flex min-w-0 flex-1 flex-col bg-[#1a1a1a]">
            <div className="flex items-center justify-between border-b border-[#3a3a3a] bg-[#282828] px-4 py-1.5">
              <Text className="!text-[#b3b3b3] text-xs">Java</Text>
              <Text className="!text-[#6e7681] text-xs">自动保存</Text>
            </div>

            <CodeEditor value={code} onChange={setCode} />

            <div className="h-[180px] border-t border-[#3a3a3a] bg-[#1a1a1a]">
              <Tabs
                activeKey={bottomTab}
                onChange={setBottomTab}
                className="quiz-tabs h-full px-2"
                items={[
                  {
                    key: 'testcase',
                    label: '测试用例',
                    children: (
                      <div className="overflow-y-auto px-2 pb-2 text-sm text-[#b3b3b3]">
                        {quiz.examples.map((ex, i) => (
                          <div key={i} className="mb-2 font-mono text-xs">
                            case {i + 1}: {ex.input} → {ex.output}
                          </div>
                        ))}
                        <Text className="!text-[#6e7681] text-xs">提示：{quiz.hint}</Text>
                      </div>
                    ),
                  },
                  {
                    key: 'result',
                    label: '测试结果',
                    children: (
                      <div className="px-2 pb-2">
                        {!result ? (
                          <Text className="!text-[#6e7681]">点击「运行」或「提交」查看结果</Text>
                        ) : (
                          <div>
                            <Tag color={result.pass ? 'success' : 'error'}>{result.pass ? '通过' : '未通过'}</Tag>
                            <Paragraph
                              className={`!mb-0 mt-2 text-sm ${result.pass ? '!text-[#2cbb5d]' : '!text-[#ff375f]'}`}
                            >
                              {result.message}
                            </Paragraph>
                            {result.pass && adj.next && (
                              <Button
                                type="link"
                                className="mt-2 px-0 !text-[#ffa116]"
                                onClick={() => navigate(`/java-route/${adj.next}`)}
                              >
                                下一章 →
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'history',
                    label: '提交记录',
                    children: (
                      <div className="overflow-y-auto px-2 pb-2">
                        {submissions.length === 0 ? (
                          <Text className="!text-[#6e7681] text-xs">暂无提交记录</Text>
                        ) : (
                          submissions.map((s, i) => (
                            <div
                              key={s.submittedAt}
                              className="mb-2 flex items-center justify-between gap-2 rounded border border-[#3a3a3a] bg-[#282828] px-3 py-2"
                            >
                              <Space size="small" wrap>
                                <Text className="!text-[#b3b3b3] text-xs">#{submissions.length - i}</Text>
                                <Text className="!text-[#8c8c8c] text-xs">
                                  {new Date(s.submittedAt).toLocaleString('zh-CN')}
                                </Text>
                                <Tag color={s.pass ? 'success' : 'error'} className="!mr-0">
                                  {s.pass ? '通过' : '未通过'}
                                </Tag>
                              </Space>
                              <Button
                                type="link"
                                size="small"
                                className="!text-[#ffa116] shrink-0"
                                onClick={() => setViewSubmit(s)}
                              >
                                查看
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={viewSubmit ? `提交记录 · ${new Date(viewSubmit.submittedAt).toLocaleString('zh-CN')}` : '提交记录'}
        open={!!viewSubmit}
        onCancel={() => setViewSubmit(null)}
        width={720}
        className="submit-code-modal"
        footer={[
          <Button key="close" onClick={() => setViewSubmit(null)}>
            关闭
          </Button>,
          <Button
            key="restore"
            type="primary"
            onClick={() => {
              if (!viewSubmit) return;
              setCode(viewSubmit.content);
              setResult({ pass: viewSubmit.pass, message: viewSubmit.message });
              setViewSubmit(null);
              setBottomTab('result');
            }}
          >
            恢复到编辑器
          </Button>,
        ]}
      >
        {viewSubmit && (
          <>
            <Space className="mb-3">
              <Tag color={viewSubmit.pass ? 'success' : 'error'}>{viewSubmit.pass ? '通过' : '未通过'}</Tag>
              <Text type="secondary" className="text-sm">
                {viewSubmit.message}
              </Text>
            </Space>
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-[#1e1e1e] p-4 font-mono text-sm leading-6 text-[#d4d4d4] whitespace-pre-wrap">
              {viewSubmit.content}
            </pre>
          </>
        )}
      </Modal>
    </SchoolLayout>
  );
};
