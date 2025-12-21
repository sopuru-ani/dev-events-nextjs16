import mongoose, { Schema, Document } from 'mongoose';

// Interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const eventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  overview: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  venue: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  mode: { type: String, required: true, enum: ['online', 'offline', 'hybrid'] },
  audience: { type: String, required: true, trim: true },
  agenda: [{ type: String, required: true }],
  organizer: { type: String, required: true, trim: true },
  tags: [{ type: String, required: true }],
}, {
  timestamps: true, // Auto-generates createdAt and updatedAt
});

// Pre-save hook for slug generation and data normalization
eventSchema.pre('save', async function(this: IEvent) {
  // Generate slug from title if title has changed or slug is empty
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  // Normalize date to ISO format if it's a valid date string
  if (this.date) {
    const dateObj = new Date(this.date);
    if (!isNaN(dateObj.getTime())) {
      this.date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
  }

  // Ensure time is in consistent format (assume HH:MM format)
  if (this.time && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.time)) {
    // Basic validation; in production, use a more robust time parser
    throw new Error('Invalid time format. Use HH:MM.');
  }
});

// Add unique index on slug
eventSchema.index({ slug: 1 }, { unique: true });

// Event model
const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;