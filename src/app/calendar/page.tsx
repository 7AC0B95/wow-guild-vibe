'use client';

import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    Users,
    Shield,
    Heart,
    Swords,
    Check,
    HelpCircle,
    X as XIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday
} from 'date-fns';

// Mock raid events
const currentYear = new Date().getFullYear();
const mockEvents = [
    {
        id: '1',
        title: 'Karazhan',
        date: new Date(currentYear, 0, 17),
        startTime: '20:00',
        maxTanks: 2,
        maxHealers: 3,
        maxDps: 5,
        signups: {
            tanks: 2,
            healers: 3,
            dps: 4,
        },
    },
    {
        id: '2',
        title: 'SSC + TK',
        date: new Date(currentYear, 0, 21),
        startTime: '19:00',
        maxTanks: 3,
        maxHealers: 7,
        maxDps: 15,
        signups: {
            tanks: 2,
            healers: 5,
            dps: 12,
        },
    },
    {
        id: '3',
        title: 'Gruul + Mag',
        date: new Date(currentYear, 0, 24),
        startTime: '21:00',
        maxTanks: 2,
        maxHealers: 6,
        maxDps: 17,
        signups: {
            tanks: 2,
            healers: 6,
            dps: 15,
        },
    },
];

type SignupStatus = 'signed' | 'tentative' | 'absent' | null;

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
    const [userSignup, setUserSignup] = useState<SignupStatus>(null);
    const { user } = useAuth();

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const days: Date[] = [];
        let day = startDate;
        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    }, [currentMonth]);

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return mockEvents.filter((event) => isSameDay(event.date, date));
    };

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        const events = getEventsForDate(date);
        if (events.length > 0) {
            setSelectedEvent(events[0]);
        } else {
            setSelectedEvent(null);
        }
    };

    const handleSignup = (status: SignupStatus) => {
        setUserSignup(status);
    };

    return (
        <div className="min-h-screen portal-bg pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="gothic-heading text-4xl text-text-primary mb-2 flex items-center gap-3">
                            <CalendarIcon className="w-10 h-10 text-ethereal-purple" />
                            Raid Calendar
                        </h1>
                        <p className="text-text-secondary">
                            Sign up for upcoming raids and never miss a boss kill
                        </p>
                    </div>
                    {user && (
                        <Button icon={<Plus className="w-4 h-4" />}>
                            Create Event
                        </Button>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2">
                        <Card variant="stone">
                            {/* Calendar Header */}
                            <CardHeader className="flex flex-row items-center justify-between">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 rounded-lg hover:bg-obsidian-lighter transition-colors text-text-secondary hover:text-text-primary"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="gothic-heading text-xl text-text-primary">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </h2>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 rounded-lg hover:bg-obsidian-lighter transition-colors text-text-secondary hover:text-text-primary"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </CardHeader>

                            <CardContent className="p-2 sm:p-6">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 mb-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div
                                            key={day}
                                            className="text-center text-xs sm:text-sm font-medium text-text-muted py-2"
                                        >
                                            <span className="hidden sm:inline">{day}</span>
                                            <span className="sm:hidden">{day[0]}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {calendarDays.map((day, index) => {
                                        const events = getEventsForDate(day);
                                        const isCurrentMonth = isSameMonth(day, currentMonth);
                                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                                        const hasEvents = events.length > 0;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleDateClick(day)}
                                                className={`
                          aspect-square sm:aspect-auto sm:min-h-[80px] p-1 sm:p-2 rounded-lg 
                          flex flex-col items-center sm:items-start justify-start
                          transition-all duration-200
                          ${!isCurrentMonth ? 'opacity-30' : ''}
                          ${isSelected
                                                        ? 'bg-fel-green/20 border-2 border-fel-green'
                                                        : 'hover:bg-obsidian-lighter border border-transparent'
                                                    }
                          ${isToday(day) ? 'ring-2 ring-ethereal-purple ring-offset-2 ring-offset-obsidian-light' : ''}
                        `}
                                            >
                                                <span className={`
                          text-sm sm:text-base font-medium
                          ${isToday(day) ? 'text-ethereal-purple' : 'text-text-primary'}
                        `}>
                                                    {format(day, 'd')}
                                                </span>

                                                {/* Event indicators */}
                                                {hasEvents && (
                                                    <div className="mt-1 space-y-1 w-full hidden sm:block">
                                                        {events.slice(0, 2).map((event) => (
                                                            <div
                                                                key={event.id}
                                                                className="text-xs px-1.5 py-0.5 rounded bg-ethereal-purple/30 text-ethereal-purple truncate"
                                                            >
                                                                {event.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {hasEvents && (
                                                    <div className="sm:hidden mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-ethereal-purple" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Event Details Sidebar */}
                    <div className="lg:col-span-1">
                        {selectedEvent ? (
                            <Card variant="stone">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <h3 className="gothic-heading text-xl text-text-primary">
                                            {selectedEvent.title}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            className="p-1 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            <XIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Date & Time */}
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <Clock className="w-5 h-5 text-fel-green" />
                                        <div>
                                            <p className="font-medium text-text-primary">
                                                {format(selectedEvent.date, 'EEEE, MMMM d')}
                                            </p>
                                            <p className="text-sm">{selectedEvent.startTime} Server Time</p>
                                        </div>
                                    </div>

                                    {/* Role Tally */}
                                    <div>
                                        <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Role Signups
                                        </h4>
                                        <div className="space-y-2">
                                            {/* Tanks */}
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-obsidian">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-[#4a90d9]" />
                                                    <span className="text-sm text-text-primary">Tanks</span>
                                                </div>
                                                <span className={`text-sm font-medium ${selectedEvent.signups.tanks >= selectedEvent.maxTanks
                                                    ? 'text-fel-green' : 'text-ancient-gold'
                                                    }`}>
                                                    {selectedEvent.signups.tanks}/{selectedEvent.maxTanks}
                                                </span>
                                            </div>

                                            {/* Healers */}
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-obsidian">
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-[#4aff4a]" />
                                                    <span className="text-sm text-text-primary">Healers</span>
                                                </div>
                                                <span className={`text-sm font-medium ${selectedEvent.signups.healers >= selectedEvent.maxHealers
                                                    ? 'text-fel-green' : 'text-ancient-gold'
                                                    }`}>
                                                    {selectedEvent.signups.healers}/{selectedEvent.maxHealers}
                                                </span>
                                            </div>

                                            {/* DPS */}
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-obsidian">
                                                <div className="flex items-center gap-2">
                                                    <Swords className="w-4 h-4 text-[#ff4a4a]" />
                                                    <span className="text-sm text-text-primary">DPS</span>
                                                </div>
                                                <span className={`text-sm font-medium ${selectedEvent.signups.dps >= selectedEvent.maxDps
                                                    ? 'text-fel-green' : 'text-ancient-gold'
                                                    }`}>
                                                    {selectedEvent.signups.dps}/{selectedEvent.maxDps}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signup Buttons */}
                                    {user ? (
                                        <div>
                                            <h4 className="text-sm font-medium text-text-secondary mb-3">
                                                Your Status
                                            </h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => handleSignup('signed')}
                                                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${userSignup === 'signed'
                                                        ? 'bg-fel-green/20 border-fel-green text-fel-green'
                                                        : 'border-stone-border text-text-secondary hover:border-fel-green hover:text-fel-green'
                                                        }`}
                                                >
                                                    <Check className="w-5 h-5" />
                                                    <span className="text-xs">Sign Up</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSignup('tentative')}
                                                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${userSignup === 'tentative'
                                                        ? 'bg-ancient-gold/20 border-ancient-gold text-ancient-gold'
                                                        : 'border-stone-border text-text-secondary hover:border-ancient-gold hover:text-ancient-gold'
                                                        }`}
                                                >
                                                    <HelpCircle className="w-5 h-5" />
                                                    <span className="text-xs">Tentative</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSignup('absent')}
                                                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${userSignup === 'absent'
                                                        ? 'bg-hellfire-red/20 border-hellfire-red text-hellfire-red'
                                                        : 'border-stone-border text-text-secondary hover:border-hellfire-red hover:text-hellfire-red'
                                                        }`}
                                                >
                                                    <XIcon className="w-5 h-5" />
                                                    <span className="text-xs">Absent</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-lg bg-obsidian border border-stone-border text-center">
                                            <p className="text-sm text-text-secondary mb-3">
                                                Sign in to register for this raid
                                            </p>
                                            <Button size="sm" className="w-full">
                                                Sign In
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card variant="glass">
                                <CardContent className="py-16 text-center">
                                    <CalendarIcon className="w-12 h-12 mx-auto text-text-muted mb-4" />
                                    <p className="text-text-secondary">
                                        Select a date to view raid events
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Upcoming Raids Quick View */}
                        <Card variant="glass" className="mt-4">
                            <CardHeader>
                                <h3 className="text-sm font-medium text-text-secondary">Upcoming Raids</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {mockEvents.slice(0, 3).map((event) => (
                                    <button
                                        key={event.id}
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setSelectedDate(event.date);
                                        }}
                                        className="w-full p-3 rounded-lg bg-obsidian/50 border border-stone-border hover:border-ethereal-purple transition-colors text-left"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-text-primary">{event.title}</span>
                                            <span className="text-xs text-text-muted">{event.startTime}</span>
                                        </div>
                                        <p className="text-xs text-text-muted">
                                            {format(event.date, 'EEE, MMM d')}
                                        </p>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
