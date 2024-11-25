import { io } from "socket.io-client";

const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });

export default socket;

