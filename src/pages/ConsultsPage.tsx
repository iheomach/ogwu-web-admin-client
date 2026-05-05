import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHospital } from '../lib/useHospital';
import type { ConsultThread, ConsultMessage } from '../lib/types';
import { AppShell, PageHeader } from '../components/layout/AppShell';
import { UrgencyBadge, StatusBadge } from '../components/ui/Badge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let out = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { out += syms[i]; n -= vals[i]; }
  }
  return out;
}

function conditionBase(thread: ConsultThread): string {
  if (thread.title) return thread.title;
  const s = (thread.intake_snapshot?.summary ?? '').trim();
  if (s) return s.split(/\s+/).slice(0, 6).join(' ');
  return 'New consult';
}

function buildThreadTitles(threads: ConsultThread[]): Map<string, string> {
  // Group by patient_id + condition so different patients with similar conditions
  // don't get numbered, but the same patient's follow-ups do.
  const groups = new Map<string, ConsultThread[]>();
  for (const t of threads) {
    const key = `${t.patient_id}||${conditionBase(t)}`;
    const g = groups.get(key) ?? [];
    g.push(t);
    groups.set(key, g);
  }

  const result = new Map<string, string>();
  for (const [key, group] of groups) {
    const base = key.split('||').slice(1).join('||');
    if (group.length === 1) {
      result.set(group[0].id, base);
    } else {
      // Sort ascending by created_at so oldest gets roman numeral I
      const sorted = [...group].sort((a, b) => a.created_at.localeCompare(b.created_at));
      sorted.forEach((t, i) => result.set(t.id, `${base} ${toRoman(i + 1)}`));
    }
  }
  return result;
}

export function ConsultsPage() {
  const { hospitalId, loading: hospitalLoading } = useHospital();
  const [threads, setThreads] = useState<ConsultThread[]>([]);
  const [selected, setSelected] = useState<ConsultThread | null>(null);
  const [messages, setMessages] = useState<ConsultMessage[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (hospitalLoading || !hospitalId) return;
    let mounted = true;
    (async () => {
      setFetchError(null);

      // Step 1: get patient IDs who have appointments at this hospital
      console.log('[Consults] hospitalId:', hospitalId);
      const { data: apptRows, error: apptError } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('hospital_id', hospitalId);

      console.log('[Consults] apptRows:', apptRows, 'error:', apptError);

      const patientIds = [...new Set((apptRows ?? []).map(r => r.patient_id))];
      console.log('[Consults] patientIds:', patientIds);

      if (!patientIds.length) {
        if (mounted) { setThreads([]); setLoading(false); }
        return;
      }

      // Step 2: fetch consult threads for those patients
      const { data: threadData, error: threadError } = await supabase
        .from('consult_threads')
        .select('*')
        .in('patient_id', patientIds)
        .order('updated_at', { ascending: false });

      console.log('[Consults] threadData:', threadData, 'error:', threadError);
      if (threadError) {
        console.error('[ConsultsPage] threads fetch error:', threadError);
        if (mounted) { setFetchError(threadError.message); setLoading(false); }
        return;
      }

      const profileMap: Record<string, any> = {};
      if (patientIds.length) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, phone')
          .in('id', patientIds);
        if (profileError) console.error('[ConsultsPage] profiles fetch error:', profileError);
        (profileData ?? []).forEach(p => { profileMap[p.id] = p; });
      }

      if (mounted) {
        setThreads((threadData ?? []).map(t => ({ ...t, patient: profileMap[t.patient_id] ?? null })));
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [hospitalId, hospitalLoading]);

  const threadTitles = useMemo(() => buildThreadTitles(threads), [threads]);

  const openThread = async (thread: ConsultThread) => {
    setSelected(thread);
    const { data } = await supabase
      .from('consult_messages')
      .select('*')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true });
    setMessages(data ?? []);
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    const { data } = await supabase
      .from('consult_messages')
      .insert({ thread_id: selected.id, sender_role: 'provider', body: reply.trim() })
      .select()
      .single();
    if (data) setMessages(prev => [...prev, data]);
    setReply('');
    setSending(false);
  };

  return (
    <AppShell>
      <PageHeader title="Consults" subtitle="Async consultation threads from patients." />

      <div className="flex gap-5 h-[calc(100vh-160px)]">

        {/* Thread list */}
        <div className="w-72 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center pt-8">
              <div className="spinner spinner--md" />
            </div>
          ) : fetchError ? (
            <div className="pt-4">
              <p className="text-sm font-medium text-red-600">Failed to load</p>
              <p className="text-xs text-grey-500 mt-1 break-all">{fetchError}</p>
            </div>
          ) : threads.length === 0 ? (
            <p className="text-sm text-grey-500 pt-4">No consult threads yet.</p>
          ) : (
            threads.map(t => (
              <button
                key={t.id}
                onClick={() => openThread(t)}
                className={[
                  'card text-left px-4 py-3.5 hover:border-purple/30 transition-colors',
                  selected?.id === t.id ? 'border-purple/40 bg-purple-light/60' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <p className="text-sm font-medium text-grey-900 truncate leading-snug">
                    {threadTitles.get(t.id) ?? conditionBase(t)}
                  </p>
                  <ChevronRight size={14} className="text-grey-300 shrink-0" />
                </div>
                {(t.patient?.first_name || t.patient?.last_name) && (
                  <p className="text-xs text-grey-500 mb-1.5 truncate">
                    {t.patient.first_name} {t.patient.last_name}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <UrgencyBadge urgency={t.urgency} />
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-grey-500 mt-2">{formatDate(t.created_at)}</p>
              </button>
            ))
          )}
        </div>

        {/* Thread detail */}
        <div className="flex-1 flex flex-col card overflow-hidden p-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-12 h-12 rounded-lg bg-purple-light flex items-center justify-center mb-3">
                <ChevronRight size={20} className="text-purple" />
              </div>
              <p className="text-sm font-medium text-grey-900">Select a consult</p>
              <p className="text-xs text-grey-500 mt-1">Pick a thread from the left to view the conversation.</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-6 py-4 border-b border-purple/[0.08] flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-grey-900">
                    {threadTitles.get(selected.id) ?? conditionBase(selected)}
                  </p>
                  <p className="text-xs text-grey-500 mt-0.5">
                    {selected.patient?.first_name} {selected.patient?.last_name}
                    {selected.intake_snapshot?.summary && (
                      <span className="ml-1">· {selected.intake_snapshot.summary.slice(0, 80)}{selected.intake_snapshot.summary.length > 80 ? '…' : ''}</span>
                    )}
                  </p>
                </div>
                <UrgencyBadge urgency={selected.urgency} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {messages.map(m => {
                  const isProvider = m.sender_role === 'provider';
                  const isSystem   = m.sender_role === 'system';
                  return (
                    <div key={m.id} className={`flex ${isProvider ? 'justify-end' : 'justify-start'}`}>
                      <div className={`chat-bubble ${
                        isProvider ? 'chat-bubble--provider' :
                        isSystem   ? 'chat-bubble--system'   :
                                     'chat-bubble--patient'
                      }`}>
                        <p className="leading-relaxed">{m.body}</p>
                        <p className={`chat-bubble-meta ${isProvider ? 'chat-bubble-meta--provider' : 'chat-bubble-meta--other'}`}>
                          {formatDate(m.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply input / closed notice */}
              {selected.status === 'closed' ? (
                <div className="px-6 py-4 border-t border-purple/[0.08] flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm text-grey-500">This conversation has ended.</p>
                </div>
              ) : (
                <div className="px-6 py-4 border-t border-purple/[0.08]">
                  <div className="chat-input-bar">
                    <textarea
                      className="chat-input-textarea"
                      rows={1}
                      placeholder="Write a reply..."
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); }
                      }}
                    />
                    <button
                      onClick={sendReply}
                      disabled={sending || !reply.trim()}
                      className="chat-send-button"
                    >
                      {sending
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Send size={16} strokeWidth={2} />
                      }
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </AppShell>
  );
}
