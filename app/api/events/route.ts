import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error: unknown) {
            return NextResponse.json({msg: 'Invalid JSON data format'}, {status: 400});
        }

        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({msg: 'Image file is required'}, {status: 400});
        }

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        if (typeof event.title === 'string'){
            event.slug = event.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
        }
        
        const createdEvent = await Event.create({...event, tags: tags, agenda: agenda });
        return NextResponse.json({msg: 'Event Created Successfully', event: createdEvent}, {status: 201});
    } catch (error: unknown) {
        return NextResponse.json({msg: 'Event Creation Failed', error: error instanceof Error ? error.message : "Unknown Error"}, {status: 500});
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ msg: 'Events fetched successfully', events }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ msg: 'Event fetching failed', error: error instanceof Error ? error.message : "Unknown Error"}, { status: 500 });
    }
}