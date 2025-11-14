import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Registration {
  registration_id: string;
  full_name: string;
}
interface Visit {
  id: number;
  scheduled_date: string;
  time_slot: string;
  status: string;
  notes: string | null;
  registration?: Registration | null;
  // root-level fallbacks
  registration_id?: string;
  full_name?: string;
  registration_code?: string;
  registration_full_name?: string;
}
interface Link { url: string | null; label: string; active: boolean; }
interface Paginated<T> { data: T[]; current_page: number; last_page: number; per_page: number; total: number; links: Link[]; }
interface Props {
  visits: Paginated<Visit>;
  time_slots: string[];
  statuses: string[];
  filters?: { search?: string };
}

export default function HomeVisitIndex(p: Props) {
  const paged = p.visits;
  const rows = paged.data ?? [];
  const links = paged.links ?? [];
  const timeSlots = p.time_slots ?? [];
  const statuses = p.statuses ?? [];
  const { can } = usePermissions();

  // Handle alert notifications
  const { props } = usePage();
  useEffect(() => {
    if (props.alert) {
      alert(props.alert);
    }
  }, [props.alert]);

  // schedule form
  const [registrationInput, setRegistrationInput] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // search
  const initialSearch = useMemo(() => p.filters?.search || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('search') || '' : ''), [p.filters?.search]);
  const [search, setSearch] = useState(initialSearch);
  useEffect(() => setSearch(initialSearch), [initialSearch]);

  const performSearch = () => {
    router.get('/admin/senior-citizen-home-visit', { search: search || undefined }, { preserveScroll: true });
  };

  const handleSchedule = () => {
    setScheduleLoading(true);
    router.post('/admin/senior-citizen-home-visit', {
      registration_id: registrationInput.trim(),
      scheduled_date: scheduledDate,
      time_slot: timeSlot,
      notes: notes || undefined,
    }, {
      onFinish: () => {
        setScheduleLoading(false);
        setRegistrationInput('');
        setTimeSlot('');
        setNotes('');
        router.get('/admin/senior-citizen-home-visit', { search: search || undefined }, { preserveScroll: true });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this visit?')) return;
    router.delete(`/admin/senior-citizen-home-visit/${id}`, {
      preserveScroll: true,
      onSuccess: () => router.get('/admin/senior-citizen-home-visit', { search: search || undefined }, { preserveScroll: true })
    });
  };

  // update modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Visit | null>(null);
  const [updStatus, setUpdStatus] = useState('');
  const [updDate, setUpdDate] = useState('');
  const [updSlot, setUpdSlot] = useState('');
  const [updNotes, setUpdNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const openModal = (v: Visit) => {
    setSelected(v);
    setUpdStatus(v.status);
    setUpdDate(v.scheduled_date);
    setUpdSlot(v.time_slot);
    setUpdNotes(v.notes || '');
    setOpen(true);
  };

  const submitUpdate = () => {
    if (!selected) return;
    setUpdating(true);
    const payload: Record<string, any> = { status: updStatus };
    if (updStatus === 'Re-Scheduled') {
      payload.scheduled_date = updDate;
      payload.time_slot = updSlot;
    }
    if (updNotes) payload.notes = updNotes;
    router.patch(`/admin/senior-citizen-home-visit/${selected.id}/status`, payload, {
      onFinish: () => {
        setUpdating(false);
        setOpen(false);
        setSelected(null);
        router.get('/admin/senior-citizen-home-visit', { search: search || undefined }, { preserveScroll: true });
      }
    });
  };

  const from = (paged.current_page - 1) * paged.per_page + (rows.length ? 1 : 0);
  const to = Math.min(paged.current_page * paged.per_page, paged.total);

  // unified access helpers
  const getRegId = (v: Visit) =>
    v.registration?.registration_id ||
    v.registration_code ||
    v.registration_id ||
    '—';

  const getFullName = (v: Visit) =>
    v.registration?.full_name ||
    v.registration_full_name ||
    v.full_name ||
    '—';

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Home Visit', href: '/admin/senior-citizen-home-visit' },
    ]}>
      <Head title="Home Visits" />
      <div className="p-4 flex flex-col gap-4">
        {can('senior_citizen_home_visits.create') && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule Home Visit</CardTitle>
              <CardDescription>Create new visit entries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium">Registration ID</label>
                  <input
                    value={registrationInput}
                    onChange={e => setRegistrationInput(e.target.value)}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    placeholder="OSCA-YYYYMM-####"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium">Time Slot</label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(ts => <SelectItem key={ts} value={ts}>{ts}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium">Notes</label>
                  <input
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    placeholder="Optional notes"
                  />
                </div>
                <div className="flex-none flex items-end">
                  <Button
                    disabled={scheduleLoading || !registrationInput.trim() || !scheduledDate || !timeSlot}
                    onClick={handleSchedule}
                    className="w-full"
                  >
                    {scheduleLoading ? 'Saving...' : 'Schedule'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>All Visits</CardTitle>
                <CardDescription>Registration ID & Name should now display.</CardDescription>
              </div>
              <div className="flex gap-2">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') performSearch(); }}
                  className="border rounded px-3 py-2 text-sm w-60"
                  placeholder="Search registration or notes"
                />
                <Button variant="secondary" onClick={performSearch}>Search</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    {(can('senior_citizen_home_visits.edit') || can('senior_citizen_home_visits.delete')) && (
                      <TableHead className="w-[130px] text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="whitespace-nowrap text-sm">{getRegId(v)}</TableCell>
                      <TableCell className="text-sm font-medium">{getFullName(v)}</TableCell>
                      <TableCell className="text-sm">{new Date(v.scheduled_date).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{v.time_slot}</Badge></TableCell>
                      <TableCell><Badge className="text-xs">{v.status}</Badge></TableCell>
                      <TableCell className="max-w-[260px] truncate text-xs" title={v.notes || ''}>{v.notes || ''}</TableCell>
                      {(can('senior_citizen_home_visits.edit') || can('senior_citizen_home_visits.delete')) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {can('senior_citizen_home_visits.edit') && v.status !== 'Completed' && (
                              <Button size="sm" variant="ghost" onClick={() => openModal(v)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {can('senior_citizen_home_visits.delete') && (
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(v.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={(can('senior_citizen_home_visits.edit') || can('senior_citizen_home_visits.delete')) ? 7 : 6} className="text-center py-6 text-sm text-muted-foreground">
                        No visits found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {links.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {paged.total > 0
                    ? <>Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{paged.total}</span> results</>
                    : 'No results'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {links.map((l, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={l.active ? 'default' : 'outline'}
                      disabled={!l.url}
                      onClick={() => l.url && router.get(l.url, {}, { preserveScroll: true })}
                      className="h-8"
                    >
                      <span dangerouslySetInnerHTML={{ __html: l.label.replace('&laquo;', '«').replace('&raquo;', '»') }} />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={o => { if (!o) { setOpen(false); setSelected(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Visit</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium">Registration</p>
                  <p className="text-muted-foreground">{getRegId(selected)}</p>
                </div>
                <div>
                  <p className="font-medium">Current Date</p>
                  <p className="text-muted-foreground">{new Date(selected.scheduled_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Status</label>
                <Select value={updStatus} onValueChange={setUpdStatus}>
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {updStatus === 'Re-Scheduled' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">New Date</label>
                    <input
                      type="date"
                      value={updDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={e => setUpdDate(e.target.value)}
                      className="mt-1 w-full border rounded px-2 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">New Slot</label>
                    <Select value={updSlot} onValueChange={setUpdSlot}>
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue placeholder="Slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(ts => <SelectItem key={ts} value={ts}>{ts}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium">Notes</label>
                <input
                  value={updNotes}
                  onChange={e => setUpdNotes(e.target.value)}
                  placeholder="Optional notes"
                  className="mt-1 w-full border rounded px-2 py-2 text-xs"
                />
              </div>
              <DialogFooter className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setOpen(false); setSelected(null); }}>Cancel</Button>
                <Button
                  disabled={updating || !updStatus || (updStatus === 'Re-Scheduled' && (!updDate || !updSlot))}
                  onClick={submitUpdate}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
