import { useEffect, useState } from "react";
import { AgendaEditDrawer } from "./AgendaEditDrawer";
import { AgendaEventModal } from "./AgendaEventModal";
import { OverviewHeader } from "./OverviewHeader";
import { TodoPanel } from "./TodoPanel";
import { WeeklyAgendaTimeline } from "./WeeklyAgendaTimeline";
import type { AgendaEvent, AgendaEventModalState, UniLink } from "../types";

type HomeDashboardProps = {
  events: AgendaEvent[];
  quickLinks: UniLink[];
};

function loadEvents(defaultEvents: AgendaEvent[]) {
  try {
    const saved = localStorage.getItem("unidock-agenda-events");
    return saved ? (JSON.parse(saved) as AgendaEvent[]) : defaultEvents;
  } catch {
    return defaultEvents;
  }
}

export function HomeDashboard({ events: defaultEvents, quickLinks }: HomeDashboardProps) {
  const [events, setEvents] = useState<AgendaEvent[]>(() => loadEvents(defaultEvents));
  const [eventModal, setEventModal] = useState<AgendaEventModalState>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("unidock-agenda-events", JSON.stringify(events));
  }, [events]);

  function openDrawer(eventId?: string) {
    setEditingEventId(eventId ?? null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingEventId(null);
  }

  function saveEvent(event: AgendaEvent) {
    setEvents((items) => (items.some((item) => item.id === event.id) ? items.map((item) => (item.id === event.id ? event : item)) : [...items, event]));
    setEditingEventId(event.id);
  }

  function deleteEvent(id: string) {
    setEvents((items) => items.filter((event) => event.id !== id));
    setEventModal(null);
    setEditingEventId(null);
  }

  return (
    <>
      <OverviewHeader
        kicker="个人学习工作台"
        title="今天要看的东西"
        description="这里是 Home 页，只放本周日程、待办事项和常用入口。"
        quickLinks={quickLinks}
      />
      <section className="dashboard-grid" aria-label="Home 工作台">
        <WeeklyAgendaTimeline events={events} onEventOpen={setEventModal} onManageOpen={openDrawer} />
        <TodoPanel />
      </section>
      <AgendaEventModal
        modal={eventModal}
        onClose={() => setEventModal(null)}
        onDelete={deleteEvent}
        onEdit={(id) => {
          setEventModal(null);
          openDrawer(id);
        }}
      />
      <AgendaEditDrawer
        events={events}
        editingEventId={editingEventId}
        open={drawerOpen}
        onClose={closeDrawer}
        onDelete={deleteEvent}
        onEditSelect={setEditingEventId}
        onSave={saveEvent}
      />
    </>
  );
}
