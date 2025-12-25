import mongoose, { Schema, Document } from 'mongoose';
import Event from './event.model';

// Interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const bookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    slug: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
  }
);

// Pre-save hook to verify eventId exists
bookingSchema.pre<IBooking>('save', async function () {
  const event = await Event.findById(this.eventId);
  if (!event) {
    throw new Error('Referenced event does not exist');
  }
});

// Add index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Booking model
const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;