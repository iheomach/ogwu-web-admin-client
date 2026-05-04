import { useEffect, useState } from 'react';
import { ChevronRight, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHospital } from '../lib/useHospital';
import type { ConsultThread, ConsultMessage } from '../lib/types';
import { AppShell, PageHeader } from '../components/layout/AppShell';
import { UrgencyBadge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function ConsultsPage() {
  const { hospitalId, loading: hospitalLoading } = useHospital();
  const [threads, setThreads] = useState<ConsultThread[]>([]);
  const [selected, setSelected] = useState<ConsultThread | null>(null);
  const [messages, setMessages] = useState<ConsultMessage[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (hospitalLoading || !hospitalId) return;
    let mounted = true;
    (async () => {
      // Step 1: get patient IDs who have appointments at this hospital
      const { data: apptRows } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('hospital_id', hospitalId);

      const patientIds = [...new Set((apptRows ?? []).map(r => r.patient_id))];
      if (!patientIds.length) {
        if (mounted) { setThreads([]); setLoading(false); }
        return;
      }

      // Step 2: fetch consult threads for those patients
      const { data: threadData } = await supabase
        .from('consult_threads')
        .select('*')
        .in('patient_id', patientIds)
        .order('updated_at', { ascending: false });

      // Step 3: fetch patient profiles separately (avoids RLS join issues)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone')
        .in('id', patientIds);

      const profileMap = Object.fromEntries((profileData ?? []).map(p => [p.id, p]));

      if (mounted) {
        setThreads((threadData ?? []).map(t => ({ ...t, patient: profileMap[t.patient_id] ?? null })));
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [hospitalId, hospitalLoading]);

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
              <div className="w-5 h-5 border-2 border-purple border-t-transparent rounded-full animate-spin" />
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
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-grey-900 truncate">
                    {t.patient?.first_name} {t.patient?.last_name}
                  </p>
                  <ChevronRight size={14} className="text-grey-300 shrink-0" />
                </div>
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
                    {selected.patient?.first_name} {selected.patient?.last_name}
                  </p>
                  {selected.intake_snapshot?.summary && (
                    <p className="text-xs text-grey-500 mt-0.5 max-w-md truncate">
                      {selected.intake_snapshot.summary}
                    </p>
                  )}
                </div>
                <UrgencyBadge urgency={selected.urgency} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={['flex', m.sender_role === 'provider' ? 'justify-end' : 'justify-start'].join(' ')}
                  >
                    <div
                      className={[
                        'max-w-[70%] px-4 py-2.5 rounded-lg text-sm',
                        m.sender_role === 'provider'
                          ? 'bg-purple text-white'
                          : m.sender_role === 'system'
                          ? 'bg-grey-100 text-grey-500 text-xs italic'
                          : 'glass text-grey-900',
                      ].join(' ')}
                    >
                      <p className="leading-relaxed">{m.body}</p>
                      <p className={['text-[10px] mt-1', m.sender_role === 'provider' ? 'text-white/50' : 'text-grey-300'].join(' ')}>
                        {formatDate(m.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              {selected.status === 'open' && (
                <div className="px-6 py-4 border-t border-purple/[0.08] flex gap-3 items-end">
                  <textarea
                    className="flex-1 glass rounded-md px-4 py-3 text-sm text-grey-900 placeholder:text-grey-300 outline-none focus:border-purple focus:border-[1.5px] resize-none transition-colors"
                    rows={2}
                    placeholder="Write a reply..."
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply();
                    }}
                  />
                  <Button onClick={sendReply} loading={sending} size="md" className="shrink-0">
                    <Send size={15} strokeWidth={2} />
                    Send
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </AppShell>
  );
}
