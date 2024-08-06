class ServerSentEventManager {

  constructor() {
    this.streams = new Set();
    this.encoder = new TextEncoder();
  }

  addStream(stream) {
    this.streams.add(stream);
  }

  removeStream(stream) {
    this.streams.delete(stream);
  }

  broadcast (message) {
    const msg = this.encoder.encode(`data: ${message}\n\n`);
    this.streams.forEach((stream) =>  stream.enqueue(msg));
}

}

export const serverSentEventManager = new ServerSentEventManager();