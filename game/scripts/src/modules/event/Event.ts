import { EventNPCSpawned } from './EventNpcSpawned';

export class Event {
    eventNPCSpawned: EventNPCSpawned;

    constructor() {
        this.eventNPCSpawned = new EventNPCSpawned();
    }
}
