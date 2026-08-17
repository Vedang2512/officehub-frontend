import { Client } from "@stomp/stompjs";

class WebSocketService {

    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.connectCallbacks = [];
    }


    connect(onConnect) {

        const token = localStorage.getItem("token");


        if (!token) {
            console.warn(
                "No JWT token found. WebSocket connection skipped."
            );
            return;
        }


        if (this.client?.active) {

            if (this.connected && onConnect) {
                onConnect();
            }

            return;
        }



        this.client = new Client({

            brokerURL: "wss://officehub-backend.onrender.com/ws",

            connectHeaders: {
                Authorization: `Bearer ${token}`
            },


            reconnectDelay: 5000,


            debug: () => {
                // disabled
            },


           onConnect: () => {

                this.connected = true;


                if (onConnect) {
                    onConnect();
                }


                this.connectCallbacks.forEach(
                    callback => callback()
                );


            },


            onDisconnect: () => {

                this.connected = false;

            },


            onStompError: (frame) => {

                console.error(
                    "WebSocket Error:",
                    frame.headers["message"]
                );

            },


            onWebSocketClose: () => {

                this.connected = false;

            }

        });


        this.client.activate();

    }

    onConnected(callback) {

        if(this.connected) {

            callback();

        } else {

            this.connectCallbacks.push(callback);

        }

    }



    subscribe(destination, callback) {


        if (!this.connected) {

            console.warn(
                "WebSocket not connected."
            );

            return null;

        }



        if (this.subscriptions.has(destination)) {

            return this.subscriptions.get(destination);

        }



        const subscription =
            this.client.subscribe(
                destination,
                (message) => {

                    if (message.body) {

                        callback(
                            JSON.parse(message.body)
                        );

                    }

                }
            );



        this.subscriptions.set(
            destination,
            subscription
        );


        return subscription;

    }



    unsubscribe(destination) {

        const subscription =
            this.subscriptions.get(destination);


        if (subscription) {

            subscription.unsubscribe();

            this.subscriptions.delete(destination);

        }

    }



    send(destination, body) {


        if (!this.connected) {

            console.warn(
                "WebSocket not connected"
            );

            return;

        }



        this.client.publish({

            destination,

            body: JSON.stringify(body)

        });

    }



    disconnect() {


        this.subscriptions.forEach(
            (subscription) => {

                subscription.unsubscribe();

            }
        );


        this.subscriptions.clear();



        if (this.client) {

            this.client.deactivate();

        }



        this.client = null;

        this.connected = false;

    }



    isConnected() {

        return this.connected;

    }

}


export default new WebSocketService();