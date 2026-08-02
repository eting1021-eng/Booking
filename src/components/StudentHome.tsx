import { useState } from 'react';
import { Session, Booking } from '../types';
import CalendarView from './CalendarView';

interface StudentHomeProps {
  sessions: Session[];
  bookings: Booking[];
  onBookClick: (session: Session) => void;
}

export default function StudentHome({ sessions, bookings, onBookClick }: StudentHomeProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const filteredSessions = viewMode === 'list' 
    ? sessions 
    : sessions.filter(s => s.date === selectedDate);

  return (
    <div className="flex flex-col min-h-full animate-in fade-in duration-500 pb-36">
      <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">桌球課程預約</h1>
            <p className="text-[#7A7A7A] text-xs">選擇您想上的時段</p>
          </div>
          
          {/* View Toggle Switcher */}
          <div className="flex bg-[#F6F5F2] p-1 rounded-xl border border-[#C9D6D0]/50 shrink-0">
            <button 
              id="student-view-list-toggle"
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#7FA8A4] text-white shadow-sm' : 'text-[#7A7A7A] hover:text-[#2F3437]'}`}
            >
              列表
            </button>
            <button 
              id="student-view-calendar-toggle"
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-[#7FA8A4] text-white shadow-sm' : 'text-[#7A7A7A] hover:text-[#2F3437]'}`}
            >
              月曆
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-5 sm:px-6 space-y-4">
        {viewMode === 'calendar' && (
          <CalendarView 
            sessions={sessions} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        )}

        {viewMode === 'calendar' && (
          <div className="text-xs font-bold text-[#7A7A7A] px-1 mb-1">
            📅 {selectedDate} 的課程：
          </div>
        )}

        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 bg-[#F6F5F2]/50 rounded-3xl border border-dashed border-[#C9D6D0] p-6 text-sm text-[#7A7A7A] font-bold">
            {viewMode === 'calendar' 
              ? "本日尚無課程時段，點擊月曆上有標記的日期查看吧！"
              : "目前沒有可預約的課程。"
            }
          </div>
        ) : (
          filteredSessions.map((session, index) => {
            const slotsLeft = session.totalSlots - session.bookedSlots;
            const isFull = slotsLeft <= 0;
            const isPrimary = index % 2 === 0;
            
            const hasBooked = bookings.some(b => b.sessionId === session.id && b.status !== 'cancelled');

            return (
              <div 
                key={session.id} 
                className={`rounded-3xl p-5 border ${isPrimary ? 'bg-[#F6F5F2] border-transparent' : 'bg-white border-[#C9D6D0]'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-[12px] font-bold tracking-wider ${isPrimary ? 'text-[#D9A46A]' : 'text-[#7A7A7A]'}`}>
                      {session.date}
                    </span>
                    <h3 className="text-lg font-bold mt-1 text-[#2F3437]">{session.title}</h3>
                    {session.description && (
                      <p className="text-[#7A7A7A] text-xs mt-1 line-clamp-2">{session.description}</p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[12px] font-bold shadow-sm ${isPrimary ? 'bg-white text-[#7FA8A4]' : 'bg-[#F6F5F2] text-[#2F3437]'}`}>
                    ${session.price.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col text-[#7A7A7A] text-sm gap-1 mb-4 font-bold">
                  <span className="flex items-center gap-1">⏰ {session.startTime} - {session.endTime}</span>
                  {session.location && <span className="flex items-center gap-1">📍 {session.location}</span>}
                  <span className={`mt-1 flex items-center gap-1 ${isFull ? 'text-red-500' : 'text-[#7FA8A4]'}`}>
                    👤 剩餘名額: {slotsLeft}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => !hasBooked && onBookClick(session)}
                  disabled={hasBooked}
                  className={`w-full py-3 rounded-2xl font-bold shadow-md transition-shadow active:shadow-inner
                    ${hasBooked ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70' : isFull ? 'bg-orange-100 text-orange-600' : isPrimary ? 'bg-[#7FA8A4] text-white' : 'bg-[#C9D6D0] text-[#2F3437]'}`}
                >
                  {hasBooked ? '已預約' : isFull ? '候補預約' : '立即預約'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

