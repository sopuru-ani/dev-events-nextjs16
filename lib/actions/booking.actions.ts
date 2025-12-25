'use server';

import Booking from '@/database/booking.model';

import connectDB from "@/lib/mongodb";
export async function createBooking({ eventId, slug, email }: { eventId: string, slug: string, email: string }) {
    try {
        await connectDB();
        const booking = await Booking.create({ eventId, slug, email });
        return { success: true};
    } catch (error: unknown) {
        console.error('create booking failed', error instanceof Error ? error.message : 'Unknown error');
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}