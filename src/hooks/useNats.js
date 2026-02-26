    import { useEffect, useRef } from "react";
    import { connect, StringCodec } from "nats.ws";

    const NATS_URL = "ws://72.60.237.150:9222";
    const NATS_USER = "tride";
    const NATS_PASS = "TrideNats@97531";

    export function useNats(subjects, onMessage) {
    const ncRef = useRef(null);
    const cancelledRef = useRef(false);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) return;

        cancelledRef.current = false;
        const sc = StringCodec();

        async function connectNats() {
        try {
            console.log("🔄 NATS connecting...", NATS_URL);

            const nc = await connect({
            servers: NATS_URL,
            user: NATS_USER,      // ✅ username
            pass: NATS_PASS,      // ✅ password
            });

            if (cancelledRef.current) { nc.close(); return; }

            ncRef.current = nc;
            console.log("✅ NATS Connected!");

            subjects.forEach((subject) => {
            console.log(" Subscribing to:", subject);
            const sub = nc.subscribe(subject);

            (async () => {
                for await (const msg of sub) {
                if (cancelledRef.current) break;
                try {
                    const raw = sc.decode(msg.data);
                    console.log(`📨 [${subject}] raw data:`, raw);
                    const data = JSON.parse(raw);
                    onMessageRef.current(subject, data);
                } catch {
                    const raw = sc.decode(msg.data);
                    onMessageRef.current(subject, raw);
                }
                }
            })();
            });

            (async () => {
            await nc.closed();
            if (!cancelledRef.current) {
                console.warn("⚠️ NATS closed unexpectedly");
            }
            })();

        } catch (err) {
            console.error("❌ NATS Failed:", err.message);
        }
        }

        connectNats();

        return () => {
        cancelledRef.current = true;
        if (ncRef.current) {
            ncRef.current.close();
            ncRef.current = null;
            console.log("🔌 NATS Disconnected");
        }
        };
    }, [(subjects || []).join(",")]);
    }
