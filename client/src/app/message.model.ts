export class MessageModel {
    constructor(
        public priority: number,
        public content: string,
        public status: string,
        public to: string,
        public _id: string,
    ) {
    }
}
