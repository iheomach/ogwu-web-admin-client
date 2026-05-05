import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHospital } from '../lib/useHospital';
import type { ConsultThread, ConsultMessage, UrgencyTier } from '../lib/types';
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
      const sorted = [...group].sort((a, b) => a.created_at.localeCompare(b.created_at));
      sorted.forEach((t, i) => result.set(t.id, `${base} ${toRoman(i + 1)}`));
    }
  }
  return result;
}

type SortKey = 'newest' | 'oldest' | 'urgency';
type StatusFilter = 'all' | 'open' | 'closed';

const URGENCY_ORDER: Record<UrgencyTier, number> = { emergency: 0, urgent: 1, soon: 2, routine: 3 };

type PatientEntry = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
};

export function ConsultsPage() {
  const { hospitalId, loading: hospitalLoading } = useHospital();

  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [threads, setThreads] = useState<ConsultThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientEntry | null>(null);

  const [selected, setSelected] = useState<ConsultThread | null>(null);
  const [messages, setMessages] = useState<ConsultMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyTier | 'all'>('all');

  useEffect(() => {
    if (hospitalLoading || !hospitalId) return;
    let mounted = true;
    (async () => {
      setFetchError(null);

      const { data: apptRows, error: apptError } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('hospital_id', hospitalId);

      if (apptError) {
        if (mounted) { setFetchError(apptError.message); setLoading(false); }
        return;
      }

      const patientIds = [...new Set((apptRows ?? []).map(r => r.patient_id))];
      if (!patientIds.length) {
        if (mounted) setLoading(false);
        return;
      }

      const [{ data: profileData, error: profileError }, { data: threadData, error: threadError }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, phone')
          .in('id', patientIds)
          .order('first_name', { ascending: true }),
        supabase
          .from('consult_threads')
          .select('*')
          .in('patient_id', patientIds)
          .order('updated_at', { ascending: false }),
      ]);

      if (threadError) {
        if (mounted) { setFetchError(threadError.message); setLoading(false); }
        return;
      }
      if (profileError) console.error('[ConsultsPage] profiles error:', profileError);

      const profileMap: Record<string, PatientEntry> = {};
      (profileData ?? []).forEach(p => { profileMap[p.id] = p; });

      if (mounted) {
        // Only list patients who have at least one thread
        const idsWithThreads = new Set((threadData ?? []).map(t => t.patient_id));
        setPatients((profileData ?? []).filter(p => idsWithThreads.has(p.id)));
        setThreads((threadData ?? []).map(t => ({ ...t, patient: profileMap[t.patient_id] ?? null })));
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [hospitalId, hospitalLoading]);

  const threadTitles = useMemo(() => buildThreadTitles(threads), [threads]);

  const filteredPatients = useMemo(() => {
    const q = patientSearch.toLowerCase();
    if (!q) return patients;
    return patients.filter(p => {
      const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.toLowerCase();
      return name.includes(q) || (p.phone ?? '').includes(q);
    });
  }, [patients, patientSearch]);

  const patientThreads = useMemo(() => {
    if (!selectedPatient) return [];
    let list = threads.filter(t => t.patient_id === selectedPatient.id);
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    if (urgencyFilter !== 'all') list = list.filter(t => t.urgency === urgencyFilter);
    return [...list].sort((a, b) => {
      if (sortKey === 'newest') return b.updated_at.localeCompare(a.updated_at);
      if (sortKey === 'oldest') return a.updated_at.localeCompare(b.updated_at);
      return URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency];
    });
  }, [threads, selectedPatient, sortKey, statusFilter, urgencyFilter]);

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (urgencyFilter !== 'all' ? 1 : 0) + (sortKey !== 'newest' ? 1 : 0);

  const selectPatient = (p: PatientEntry) => {
    setSelectedPatient(p);
    setSelected(null);
    setMessages([]);
  };

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

  const threadCount = (p: PatientEntry) => threads.filter(t => t.patient_id === p.id).length;

  return (
    <AppShell>
      <PageHeader title="Consults" subtitle="Async consultation threads from patients." />

      <div className="flex gap-5 h-[calc(100vh-160px)]">

        {/* ── Column 1: Patient list ── */}
        <div className="w-56 shrink-0 flex flex-col gap-2">
          <input
            type="search"
            placeholder="Search patients…"
            value={patientSearch}
            onChange={e => setPatientSearch(e.target.value)}
            className="search-input"
          />

          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
            {loading ? (
              <div className="flex justify-center pt-8">
                <div className="spinner spinner--md" />
              </div>
            ) : fetchError ? (
              <p className="text-xs text-red-500 pt-4">{fetchError}</p>
            ) : filteredPatients.length === 0 ? (
              <p className="text-sm text-grey-300 pt-4">
                {patientSearch ? 'No matches.' : 'No patients with consults yet.'}
              </p>
            ) : (
              filteredPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPatient(p)}
                  className={[
                    'w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors',
                    selectedPatient?.id === p.id
                      ? 'bg-purple-light/80 border border-purple/30'
                      : 'hover:bg-purple-light/40 border border-transparent',
                  ].join(' ')}
                >
                  <div className="w-7 h-7 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-purple leading-none">
                      {[p.first_name, p.last_name].map(n => n?.trim()[0]?.toUpperCase() ?? '').join('') || '?'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-grey-900 truncate leading-snug">
                      {`${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || 'Unnamed'}
                    </p>
                    <p className="text-[11px] text-grey-300">
                      {threadCount(p)} consult{threadCount(p) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Column 2: Thread list ── */}
        <div className="w-64 shrink-0 flex flex-col gap-2">
          {/* Thread list header with filters */}
          <div className="flex items-center justify-between h-[42px]">
            {selectedPatient ? (
              <>
                <p className="text-sm font-semibold text-grey-900 truncate">
                  {`${selectedPatient.first_name ?? ''} ${selectedPatient.last_name ?? ''}`.trim()}
                </p>
                <button
                  onClick={() => setShowFilters(o => !o)}
                  className={[
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors glass shrink-0',
                    showFilters ? 'border-purple border-[1.5px] text-purple' : 'text-grey-500',
                  ].join(' ')}
                >
                  <SlidersHorizontal size={12} strokeWidth={2} />
                  Filters
                  {activeFilters > 0 && (
                    <span className="w-3.5 h-3.5 rounded-full bg-purple text-white text-[9px] font-bold flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <p className="text-sm text-grey-300">Select a patient</p>
            )}
          </div>

          {/* Filter controls */}
          {showFilters && selectedPatient && (
            <div className="card p-3 flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-grey-500 mb-1.5">Sort</p>
                <select
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value as SortKey)}
                  className="w-full glass rounded-md px-2.5 py-1.5 text-xs text-grey-900 outline-none focus:border-purple focus:border-[1.5px] appearance-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="urgency">By urgency</option>
                </select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-grey-500 mb-1.5">Status</p>
                <div className="flex gap-1">
                  {(['all', 'open', 'closed'] as StatusFilter[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={[
                        'flex-1 py-1 rounded-md text-[11px] font-medium transition-colors capitalize',
                        statusFilter === s ? 'bg-purple text-white' : 'glass text-grey-500',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-grey-500 mb-1.5">Urgency</p>
                <div className="flex flex-col gap-1">
                  {(['all', 'routine', 'soon', 'urgent', 'emergency'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => setUrgencyFilter(u)}
                      className={[
                        'w-full py-1 rounded-md text-[11px] font-medium transition-colors capitalize text-left px-2',
                        urgencyFilter === u ? 'bg-purple text-white' : 'glass text-grey-500',
                      ].join(' ')}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setSortKey('newest'); setStatusFilter('all'); setUrgencyFilter('all'); }}
                  className="text-[11px] text-grey-500 hover:text-grey-900 transition-colors text-center"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
            {!selectedPatient ? (
              <p className="text-sm text-grey-300 pt-2">—</p>
            ) : patientThreads.length === 0 ? (
              <p className="text-sm text-grey-300 pt-2">
                {activeFilters > 0 ? 'No matches.' : 'No consults yet.'}
              </p>
            ) : (
              patientThreads.map(t => (
                <button
                  key={t.id}
                  onClick={() => openThread(t)}
                  className={[
                    'card text-left px-3.5 py-3 hover:border-purple/30 transition-colors',
                    selected?.id === t.id ? 'border-purple/40 bg-purple-light/60' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-grey-900 leading-snug line-clamp-2">
                      {threadTitles.get(t.id) ?? conditionBase(t)}
                    </p>
                    <ChevronRight size={13} className="text-grey-300 shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <UrgencyBadge urgency={t.urgency} />
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-[11px] text-grey-300 mt-1.5">{formatDate(t.updated_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Column 3: Thread detail ── */}
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
              <div className="px-6 py-4 border-b border-purple/[0.08] flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-grey-900">
                    {threadTitles.get(selected.id) ?? conditionBase(selected)}
                  </p>
                  {selected.intake_snapshot?.summary && (
                    <p className="text-xs text-grey-500 mt-0.5">
                      {selected.intake_snapshot.summary.slice(0, 80)}{selected.intake_snapshot.summary.length > 80 ? '…' : ''}
                    </p>
                  )}
                </div>
                <UrgencyBadge urgency={selected.urgency} />
              </div>

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

              {selected.status === 'closed' ? (
                <div className="px-6 py-4 border-t border-purple/[0.08] flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm text-grey-500">This conversation has ended.</p>
                </div>
              ) : (
                <div className="px-6 py-4 border-t border-purple/[0.08]">
                  <div className="chat-input-bar">
                    <input
                      type="text"
                      className="chat-input-field"
                      placeholder="Write a reply..."
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendReply(); } }}
                    />
                    <button
                      onClick={sendReply}
                      disabled={sending || !reply.trim()}
                      className="chat-send-button"
                    >
                      {sending
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <ArrowRight size={18} strokeWidth={2.5} />
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
