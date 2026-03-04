import React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiX } from 'react-icons/fi';
import '../../Styles/Modal.css';

const ScheduleModal = ({ isOpen, onClose, userRole }) => {
  if (!isOpen) return null;

  const scheduleData = [
    { day: 'Monday', events: [
      { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
      { time: '10:30 AM', subject: 'Science', teacher: 'Ms. Johnson', room: '203' },
      { time: '01:00 PM', subject: 'History', teacher: 'Mr. Davis', room: '105' },
    ]},
    { day: 'Tuesday', events: [
      { time: '09:00 AM', subject: 'English', teacher: 'Mrs. Wilson', room: '102' },
      { time: '10:30 AM', subject: 'Physical Education', teacher: 'Coach Brown', room: 'Gym' },
      { time: '01:00 PM', subject: 'Art', teacher: 'Ms. Garcia', room: '201' },
    ]},
    { day: 'Wednesday', events: [
      { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
      { time: '10:30 AM', subject: 'Science Lab', teacher: 'Ms. Johnson', room: 'Lab 1' },
      { time: '01:00 PM', subject: 'Music', teacher: 'Mr. Taylor', room: 'Music Room' },
    ]},
    { day: 'Thursday', events: [
      { time: '09:00 AM', subject: 'History', teacher: 'Mr. Davis', room: '105' },
      { time: '10:30 AM', subject: 'Computer Science', teacher: 'Ms. Chen', room: 'Lab 2' },
      { time: '01:00 PM', subject: 'Study Hall', teacher: 'Mrs. Wilson', room: 'Library' },
    ]},
    { day: 'Friday', events: [
      { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
      { time: '10:30 AM', subject: 'Assembly', teacher: 'All Staff', room: 'Auditorium' },
      { time: '01:00 PM', subject: 'Clubs & Activities', teacher: 'Various', room: 'Various' },
    ]},
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg schedule-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FiCalendar /> Weekly Schedule</h3>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>
        <div className="modal-body schedule-body">
          <div className="schedule-grid">
            {scheduleData.map((day, index) => (
              <div key={index} className="schedule-day">
                <h4 className="schedule-day-header">{day.day}</h4>
                <div className="schedule-events">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="schedule-event">
                      <div className="schedule-event-time">
                        <FiClock /> {event.time}
                      </div>
                      <div className="schedule-event-details">
                        <strong>{event.subject}</strong>
                        <div className="schedule-event-meta">
                          <span><FiUser /> {event.teacher}</span>
                          <span><FiMapPin /> Room {event.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;